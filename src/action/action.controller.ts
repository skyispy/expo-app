import { BadRequestException, Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ActionService } from './action.service';
import { JwtAuthGuard } from '../auth/guards';
import type { Request } from 'express';
import { z } from 'zod';
import { InfiniteQueryResponse } from '../common/dto/response.dto';
import { BoardActionResponseSchema } from './dto/action.schema';
import { BoardActionResponseDto } from './dto/action.dto';
import { BoardEntity } from '../board/models';
import type { SortOrder, UserPayload } from '../common/types';
import { CommentResponseDto } from '../common/dto/comment.dto';
import { CommentWithBoardResponseSchema } from '../common/dto/comment.schema';

@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  // 유저 최근 본 기록 조회
  @Get('/board/:actionType')
  @UseGuards(JwtAuthGuard)
  async getBoardActions(
    @Req() req: Request,
    @Param('actionType') actionType: 'view' | 'like' | 'hide',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortOrder') sortOrder: SortOrder = 'latest',
    @Query('targetUserId') targetUserId: number | null,
  ): Promise<InfiniteQueryResponse<BoardActionResponseDto>> {
    const userId = targetUserId ? Number(targetUserId) : (req.user as UserPayload).userId;
    [page, limit] = [Number(page), Number(limit)];
    let itemList: (BoardEntity & { lastActionDate: Date })[] = [];
    let totalCount = 0;
    switch (actionType) {
      case 'view': {
        const result = await this.actionService.getRecentBoards(userId, page, limit, sortOrder);
        itemList = result.itemList;
        totalCount = result.totalCount;
        break;
      }
      case 'like': {
        const result = await this.actionService.getLikedBoards(userId, page, limit, sortOrder);
        itemList = result.itemList;
        totalCount = result.totalCount;
        break;
      }
      case 'hide': {
        const result = await this.actionService.getHiddenBoards(userId, page, limit, sortOrder);
        itemList = result.itemList;
        totalCount = result.totalCount;
        break;
      }
    }
    const { success, data, error } = z.array(BoardActionResponseSchema).safeParse(itemList);
    if (!success) {
      throw new BadRequestException('게시판 응답 데이터 검증 실패', error);
    }
    const hasNextPage = page * limit < totalCount;
    return {
      itemList: data,
      nextPage: hasNextPage ? page + 1 : null,
      totalCount,
    };
  }

  // 유저 게시물 조회
  @Get('/board')
  @UseGuards(JwtAuthGuard)
  async getUserBoard(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortOrder') sortOrder: SortOrder = 'latest',
    @Query('targetUserId') targetUserId: number | null,
  ): Promise<InfiniteQueryResponse<BoardActionResponseDto>> {
    const userId = targetUserId ? Number(targetUserId) : (req.user as UserPayload).userId;
    [page, limit] = [Number(page), Number(limit)];
    const { boardList, totalCount } = await this.actionService.getUserBoards(
      userId,
      page,
      limit,
      sortOrder,
    );
    const { success, data, error } = z.array(BoardActionResponseSchema).safeParse(boardList);
    if (!success) {
      throw new BadRequestException('내 게시판 응답 데이터 검증 실패', error);
    }
    const hasNextPage = page * limit < totalCount;
    return { itemList: data, nextPage: hasNextPage ? page + 1 : null, totalCount };
  }

  // 유저 댓글 조회
  @Get('/comment')
  @UseGuards(JwtAuthGuard)
  async getUserComments(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortOrder') sortOrder: SortOrder = 'latest',
    @Query('targetUserId') targetUserId: number | null,
  ): Promise<InfiniteQueryResponse<CommentResponseDto>> {
    const userId = targetUserId ? Number(targetUserId) : (req.user as UserPayload).userId;
    const { commentList, totalCount } = await this.actionService.getUserComments(
      userId,
      page,
      limit,
      sortOrder,
    );
    const { success, data, error } = z.array(CommentWithBoardResponseSchema).safeParse(commentList);
    if (!success) {
      throw new BadRequestException('내 댓글 응답 데이터 검증 실패', error);
    }
    const hasNextPage = page * limit < totalCount;
    return { itemList: data, nextPage: hasNextPage ? page + 1 : null, totalCount };
  }
}
