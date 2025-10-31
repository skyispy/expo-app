import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, ActionHistoryEntity } from './models';
import { ActionHistoryService } from './service/action_history.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ActionHistoryEntity])],
  controllers: [UserController],
  providers: [UserService, ActionHistoryService],
  exports: [UserService, ActionHistoryService],
})
export class UserModule {}
