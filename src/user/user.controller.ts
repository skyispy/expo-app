import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { UserSignupSchema } from './dto/user.schema';
import type { UserSignupDto } from './dto/user.schema';
import { UserEntity } from './models/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @UsePipes(new ZodValidationPipe(UserSignupSchema))
  async signup(@Body() userSignupDto: UserSignupDto): Promise<UserEntity> {
    console.log('회원가입 유저 정보 : ', userSignupDto);
    return await this.userService.createUser(userSignupDto);
  }

  @Get('/test')
  async test(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }
}
