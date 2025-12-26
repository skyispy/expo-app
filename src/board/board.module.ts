import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity, CategoryEntity } from './models';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardEntity, CategoryEntity]),
    UserModule,
    CommonModule,
    ActionModule,
  ],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
