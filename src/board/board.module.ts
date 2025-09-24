import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity, CommentEntity } from './models';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity, CommentEntity])],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
