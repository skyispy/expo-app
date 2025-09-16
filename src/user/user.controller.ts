import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/common/pipes';
import { UserRequestDto, UserResponseDto } from './dto';
import { UserProfileUpdateSchema, UserSignupSchema } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFileToDist } from '../common/utils';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(UserController.name);

  // 회원가입
  @Post('/signup')
  @UsePipes(new ZodValidationPipe(UserSignupSchema))
  async signup(@Body() userRequestDto: UserRequestDto): Promise<void> {
    this.logger.log('회원가입 유저 정보', userRequestDto);
    await this.userService.createUser(userRequestDto);
  }

  // 닉네임 중복 확인
  @Get('/check-nickname')
  async checkNickname(@Query('nickname') nickname: string): Promise<{ isDuplicate: boolean }> {
    this.logger.log('중복 확인 닉네임: ' + nickname);
    const existingUser = await this.userService.findUserByNickname(nickname);
    return { isDuplicate: !!existingUser };
  }

  // 프로필 수정
  @Put('/profile')
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(UserProfileUpdateSchema))
    userRequestDto: UserRequestDto,
  ): Promise<{ user: UserResponseDto }> {
    this.logger.log('파일 정보: ', file);
    this.logger.log('프로필 수정 유저 정보', userRequestDto);
    if (file) {
      // 파일이 업로드된 경우에만 profileImageUrl 설정
      saveFileToDist(file, 'profile-images');
      userRequestDto.profileImageUrl = `${this.configService.get<string>('BASE_URL')}/uploads/profile-images/${file.originalname}`;
    }
    const user = await this.userService.updateUserProfile(userRequestDto);
    return { user: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }) };
  }
}
