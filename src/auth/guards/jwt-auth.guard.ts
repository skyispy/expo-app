import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserPayload } from '../../common/types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // User-Agent 헤더 검사
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userAgent = request.headers['user-agent'];
    if (!userAgent) {
      throw new ForbiddenException('User-Agent가 필요합니다.');
    }
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
  // jwt 토큰 내 유저 정보 반환
  handleRequest<TUser = UserPayload>(err: any, user: UserPayload): TUser {
    if (err || !user) {
      throw new UnauthorizedException('JWT 인증이 필요합니다.');
    }
    return user as TUser;
  }
}
