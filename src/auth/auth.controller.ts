import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  ForbiddenException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { type UserLoginDto, UserLoginSchema } from '../user/dto/user.schema';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/models';
import { JwtAuthGuard, UserPayload } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 일반 로그인
  @Post('/login')
  @UsePipes(new ZodValidationPipe(UserLoginSchema))
  async login(
    @Body() userLoginDto: UserLoginDto,
    @Req() req: Request,
  ): Promise<{ user: Partial<UserEntity>; accessToken: string; refreshToken?: string }> {
    console.log('로그인 유저 정보 : ', userLoginDto);
    // 사용자 인증
    const user = await this.authService.validateUser(userLoginDto);
    const { userId, username, email } = user;
    const payload = { userId, username, email };
    // 액세스 토큰 생성
    const accessToken = this.authService.signAccessToken(payload);
    // 리프레시 토큰 생성
    const { 'user-agent': userAgent } = req.headers;
    if (userLoginDto.keepLogin && userAgent) {
      const refreshToken = await this.authService.signRefreshToken(payload, userAgent);
      return { user, accessToken, refreshToken };
    }
    return { user, accessToken };
  }
  // 소셜 로그인

  // 로그아웃
  @Post('/logout')
  async logout(@Req() req: Request): Promise<{ message: string }> {
    const { 'x-refresh-token': refreshToken, 'user-agent': userAgent } = req.headers;
    if (typeof refreshToken === 'string' && userAgent) {
      // 리프레시 토큰이 있을 때만 삭제
      await this.authService.logout(refreshToken, userAgent);
    }
    return { message: '로그아웃 되었습니다.' };
  }

  // 토큰 재발급
  @Post('/refresh')
  async refreshToken(@Req() req: Request): Promise<{ accessToken: string; refreshToken: string }> {
    const { 'x-refresh-token': refreshToken, 'user-agent': userAgent } = req.headers;
    if (typeof refreshToken !== 'string' || !userAgent) {
      throw new ForbiddenException('유효하지 않은 리프레시 토큰입니다.');
    }
    return await this.authService.renewTokensByRefreshToken(refreshToken, userAgent);
  }

  @Post('/token-login')
  @UseGuards(JwtAuthGuard)
  async tokenLogin(
    @Req() req: Request,
  ): Promise<{ user: Partial<UserEntity>; accessToken: string; refreshToken: string }> {
    // req.user는 JwtAuthGuard에서 설정한 값
    const { user: payload, headers } = req;
    if (headers['user-agent']) {
      return await this.authService.renewTokensByAccessToken(
        payload as UserPayload,
        headers['user-agent'],
      );
    }
    throw new ForbiddenException('User-Agent가 필요합니다.');
  }
}
