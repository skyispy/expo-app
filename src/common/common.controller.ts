import {
  Controller,
  Logger,
  Post,
  Get,
  UseGuards,
  Req,
  Body,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtAuthGuard } from '../auth/guards';
import type { UserPayload } from './types';
import type { CommentCreateDto } from './dto/comment.dto';
import { CommentCreateSchema } from './dto/comment.schema';
import type { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import type { InfiniteQueryResponse } from './dto/response.dto';
import type { CommentResponseDto } from './dto/comment.dto';
import { CommentResponseSchema } from './dto/comment.schema';
import { z } from 'zod';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}
  private readonly logger = new Logger(CommonController.name);

  // 댓글 생성
  @Post('/comment')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Req() req: Request,
    @Body() commentCreateDto: CommentCreateDto,
  ): Promise<void> {
    const { userId } = req.user as UserPayload;
    const validatedRequest = CommentCreateSchema.safeParse(commentCreateDto);
    if (!validatedRequest.success) {
      this.logger.warn('댓글 생성 요청 데이터 검증 실패', validatedRequest.error);
      throw new BadRequestException(validatedRequest.error.issues[0].message);
    }
    await this.commonService.createComment(commentCreateDto, userId);
  }

  // 댓글 목록 조회
  @Get('/comment')
  async getComments(
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<InfiniteQueryResponse<CommentResponseDto>> {
    page = Number(page);
    limit = Number(limit);
    const commentList = await this.commonService.getCommentListByTarget(
      targetId,
      targetType,
      page,
      limit,
    );
    const { success, data, error } = z.array(CommentResponseSchema).safeParse(commentList);
    if (!success) {
      throw new BadRequestException('댓글 목록 응답 데이터 검증 실패', error);
    }
    const totalCount = await this.commonService.countCommentListByTarget(targetId, targetType);
    const hasNextPage = page * limit < totalCount;
    return {
      itemList: data,
      nextPage: hasNextPage ? page + 1 : null,
      totalCount,
    };
  }

  // 댓글 수정
  @Put('/comment/:commentId')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Req() req: Request,
    @Body('content') content: string,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    const { userId } = req.user as UserPayload;
    const validatedRequest = CommentCreateSchema.shape.content.safeParse(content);
    if (!validatedRequest.success) {
      this.logger.warn('댓글 수정 요청 데이터 검증 실패', validatedRequest.error);
      throw new BadRequestException(validatedRequest.error.issues[0].message);
    }
    await this.commonService.updateComment(validatedRequest.data, commentId, userId);
  }

  // 댓글 삭제
  @Delete('/comment/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Req() req: Request, @Param('commentId') commentId: number): Promise<void> {
    const { userId } = req.user as UserPayload;
    await this.commonService.deleteComment(commentId, userId);
  }
}
