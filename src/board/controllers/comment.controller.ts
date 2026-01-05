import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards';
import type { Request } from 'express';
import {
  type CommentCreateDto,
  CommentCreateSchema,
  type CommentResponseDto,
  CommentResponseSchema,
} from '../dto';
import type { UserPayload } from '../../common/types';
import { z } from 'zod';
import {
  InfiniteQueryRequestDto,
  InfiniteQueryRequestSchema,
  InfiniteQueryResponse,
} from '../../common/dto';
import { CommentService } from '../services';
import { ZodValidationPipe } from '../../common/pipes';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  private readonly logger = new Logger(CommentController.name);

  // 댓글 생성
  @Post('/')
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
    await this.commentService.createComment(commentCreateDto, userId);
  }

  // 댓글 목록 조회
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getComments(
    @Req() req: Request,
    @Query(
      new ZodValidationPipe(
        InfiniteQueryRequestSchema.extend({
          boardId: z.preprocess((val) => Number(val), z.number()),
        }),
      ),
    )
    query: InfiniteQueryRequestDto & { boardId: number },
  ): Promise<InfiniteQueryResponse<CommentResponseDto>> {
    const { userId } = req.user as UserPayload;
    const { commentList, totalCount } = await this.commentService.getCommentListByTarget({
      userId,
      boardId: query.boardId,
      page: query.page,
      limit: query.limit,
    });
    const { success, data, error } = z.array(CommentResponseSchema).safeParse(commentList);
    if (!success) {
      throw new BadRequestException('댓글 목록 응답 데이터 검증 실패', error);
    }
    const hasNextPage = query.page * query.limit < totalCount;
    return new InfiniteQueryResponse(data, hasNextPage ? query.page + 1 : null, totalCount);
  }

  // 댓글 수정
  @Put('/:commentId')
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
    await this.commentService.updateComment(validatedRequest.data, commentId, userId);
  }

  // 댓글 삭제
  @Delete('/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Req() req: Request, @Param('commentId') commentId: number): Promise<void> {
    const { userId } = req.user as UserPayload;
    await this.commentService.deleteComment(commentId, userId);
  }
}
