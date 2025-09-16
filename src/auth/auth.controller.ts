import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  ForbiddenException,
  UseGuards,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes';
import { type UserLoginDto, UserLoginSchema } from '../user/dto';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/models';
import { JwtAuthGuard, UserPayload } from './guards';
import { UserResponseDto } from '../user/dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  // 일반 로그인
  @Post('/login')
  @UsePipes(new ZodValidationPipe(UserLoginSchema))
  async login(
    @Body() userLoginDto: UserLoginDto,
    @Req() req: Request,
  ): Promise<{ user: UserResponseDto; accessToken: string; refreshToken?: string }> {
    this.logger.log('로그인 유저 정보', userLoginDto);
    // 사용자 인증
    const user = await this.authService.validateUser(userLoginDto);
    const { userId, nickname, email } = user;
    const payload = { userId, nickname, email };
    // 액세스 토큰 생성
    const accessToken = this.authService.signAccessToken(payload);
    // 리프레시 토큰 생성
    const { 'user-agent': userAgent } = req.headers;
    const userResponse = plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
    if (userLoginDto.keepLogin && userAgent) {
      const refreshToken = await this.authService.signRefreshToken(payload, userAgent);
      return { user: userResponse, accessToken, refreshToken };
    }
    return { user: userResponse, accessToken };
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
  ): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string }> {
    this.logger.log('토큰 로그인 시도', req.user);
    // req.user는 JwtAuthGuard에서 설정한 값
    const { user: payload, headers } = req;
    if (headers['user-agent']) {
      const { user, accessToken, refreshToken} = await this.authService.renewTokensByAccessToken(
        payload as UserPayload,
        headers['user-agent'],
      );
      const userResponse = plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
      return { user: userResponse, accessToken, refreshToken };
    }
    throw new ForbiddenException('User-Agent가 필요합니다.');
  }

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
}
