import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/common/pipes';
import { UserProfileUpdateSchema, UserResponseSchema, UserSignupSchema } from './dto/user.schema';
import type { UserProfileUpdateDto, UserResponseDto, UserSignupDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard, UserPayload } from '../auth/guards';
import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  // 회원가입
  @Post('/signup')
  @UsePipes(new ZodValidationPipe(UserSignupSchema))
  async signup(@Body() userSignupDto: UserSignupDto): Promise<void> {
    this.logger.log('회원가입 유저 정보', userSignupDto);
    await this.userService.createUser(userSignupDto);
  }

  // 닉네임 중복 확인
  @Get('/check-nickname')
  async checkNickname(@Query('nickname') nickname: string): Promise<boolean> {
    this.logger.log('중복 확인 닉네임: ' + nickname);
    const existingUser = await this.userService.findUserByNickname(nickname);
    return !!existingUser;
  }

  // 프로필 수정
  @Put('/profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: Request,
    @Body(new ZodValidationPipe(UserProfileUpdateSchema))
    userProfileUpdateDto: UserProfileUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    this.logger.log('프로필 수정 정보', userProfileUpdateDto);
    const userPayload = req.user as UserPayload;
    const user = await this.userService.updateUserProfile(userPayload.userId, userProfileUpdateDto);
    if (file) {
      user.profileImageUrl = await this.userService.uploadProfileImage(file, user.userId);
    }
    const validateUser = UserResponseSchema.safeParse(user);
    if (!validateUser.success) {
      throw new ConflictException('프로필 수정 후 유효성 검사에 실패했습니다.');
    }
    return validateUser.data;
  }
}
