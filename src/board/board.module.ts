import { Module } from '@nestjs/common';
import { BoardService, CommentService } from './services';
import { BoardController, CommentController } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity, CategoryEntity, CommentEntity } from './models';
import { UserModule } from '../user/user.module';
import { ActionModule } from '../action/action.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardEntity, CategoryEntity, CommentEntity]),
    UserModule,
    ActionModule,
  ],
  providers: [BoardService, CommentService],
  controllers: [BoardController, CommentController],
})
export class BoardModule {}
