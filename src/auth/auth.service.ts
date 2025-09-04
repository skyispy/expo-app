import { Injectable, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from '../user/dto/user.schema';
import { UserEntity } from '../user/models';
import { RefreshTokensEntity } from './models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPayload } from './guards';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokensRepository: Repository<RefreshTokensEntity>,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  // 사용자 인증
  async validateUser(userLoginDto: UserLoginDto): Promise<Partial<UserEntity>> {
    const user = await this.userService.findUserByEmail(userLoginDto.email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 계정입니다.');
    }
    // 비밀번호 검증
    if (await bcrypt.compare(userLoginDto.password, user.password)) {
      const { password, createAt, updateAt, ...rest } = user;
      return rest;
    } else {
      throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  }

  // 액세스 토큰 발급
  signAccessToken(payload: Partial<UserEntity>): string {
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  // 리프레시 토큰 발급
  async signRefreshToken(payload: Partial<UserEntity>, userAgent: string): Promise<string> {
    const refreshToken: string = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: 'secret_refresh_key',
    });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30일

    const refreshTokenEntity = this.refreshTokensRepository.create({
      userId: payload.userId,
      refreshToken,
      userAgent,
      expiresAt,
    });
    await this.refreshTokensRepository.save(refreshTokenEntity);

    return refreshToken;
  }

  // 토큰 재발급
  async renewTokensByRefreshToken(
    refreshToken: string,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 리프레시 토큰 검증
    let payload: Partial<UserEntity>;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, { secret: 'secret_refresh_key' });
    } catch (e) {
      throw new ForbiddenException('유효하지 않은 리프레시 토큰입니다.');
    }
    // DB에서 리프레시 토큰 조회
    const storedToken = await this.refreshTokensRepository.findOneBy({ refreshToken, userAgent });
    if (!storedToken) {
      throw new ForbiddenException('유효하지 않은 리프레시 토큰입니다.');
    }
    // 새로운 액세스 토큰 발급
    const { userId, nickname, email } = payload;
    const newPayload = { userId, nickname, email };
    const newAccessToken = this.signAccessToken(newPayload);
    // 새로운 리프레시 토큰 발급
    const newRefreshToken = await this.signRefreshToken(newPayload, userAgent);
    // 기존 리프레시 토큰 삭제
    await this.refreshTokensRepository.update(
      { tokenId: storedToken.tokenId },
      { refreshToken: newRefreshToken },
    );
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async renewTokensByAccessToken(
    payload: UserPayload,
    userAgent: string,
  ): Promise<{ user: Partial<UserEntity>; accessToken: string; refreshToken: string }> {
    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.');
    }
    // DB에서 리프레시 토큰 조회
    const storedToken = await this.refreshTokensRepository.findOneBy({
      userId: payload.userId,
      userAgent,
    });
    if (!storedToken) {
      throw new ForbiddenException('유효하지 않은 리프레시 토큰입니다.');
    }
    // 새로운 액세스 토큰 발급
    const { userId, nickname, email } = payload;
    const newPayload = { userId, nickname, email };
    const newAccessToken = this.signAccessToken(newPayload);
    // 새로운 리프레시 토큰 발급
    const newRefreshToken = await this.signRefreshToken(newPayload, userAgent);
    // 리프레시 토큰 업데이트
    await this.refreshTokensRepository.update(
      { tokenId: storedToken.tokenId },
      { refreshToken: newRefreshToken },
    );

    const { password, createAt, updateAt, ...rest } = user;
    return { user: rest, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // 로그아웃
  async logout(refreshToken: string, userAgent: string): Promise<void> {
    await this.refreshTokensRepository.delete({ refreshToken, userAgent });
  }
}
