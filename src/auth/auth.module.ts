import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { RefreshTokensEntity } from './models';
import { UserEntity } from '../user/models';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret_key',
    }),
    TypeOrmModule.forFeature([UserEntity, RefreshTokensEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
