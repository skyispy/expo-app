import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './models';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), UserModule],
  providers: [CommonService],
  controllers: [CommonController],
  exports: [CommonService],
})
export class CommonModule {}
