import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HiddenEntity, LikeEntity, ViewHistoryEntity } from './models';
import { BoardEntity } from '../board/models';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, ViewHistoryEntity, LikeEntity, HiddenEntity])],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
