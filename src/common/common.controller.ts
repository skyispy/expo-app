import { Controller, Logger, Post, Get, UseGuards, Req, Body, Query } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtAuthGuard, UserPayload } from '../auth/guards';
import type { CommentCreateDto } from './dto/comment.dto';
import { CommentCreateSchema } from './dto/comment.schema';
import type { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import type { InfiniteQueryResponse } from './dto/response.dto';
import type { CommentResponseDto } from './dto/comment.dto';
import { CommentResponseSchema } from './dto/comment.schema';

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
    const validateCommentList = commentList
      .map((comment) => CommentResponseSchema.safeParse(comment))
      .filter((result) => result.success)
      .map((result) => result.data);
    const totalCount = await this.commonService.countCommentListByTarget(targetId, targetType);
    const hasNextPage = page * limit < totalCount;
    return {
      itemList: validateCommentList,
      nextPage: hasNextPage ? page + 1 : null,
      totalCount,
    };
  }
}
