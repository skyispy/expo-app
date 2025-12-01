import { BadRequestException, Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ActionService } from './action.service';
import { JwtAuthGuard, UserPayload } from '../auth/guards';
import type { Request } from 'express';
import { z } from 'zod';
import { InfiniteQueryResponse } from '../common/dto/response.dto';
import { BoardActionResponseSchema } from './dto/action.schema';
import { BoardActionResponseDto } from './dto/action.dto';
import { BoardEntity } from '../board/models';

@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  // 유저 최근 본 기록 조회
  @Get('/board/:actionType')
  @UseGuards(JwtAuthGuard)
  async getBoardActions(
    @Param('actionType') actionType: 'view' | 'like' | 'hide',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
  ): Promise<InfiniteQueryResponse<BoardActionResponseDto>> {
    const { userId } = req.user as UserPayload;
    [page, limit] = [Number(page), Number(limit)];
    let itemList: (BoardEntity & { lastActionDate: Date })[] = [];
    let totalCount = 0;
    switch (actionType) {
      case 'view': {
        const result = await this.actionService.getRecentBoards(
          userId,
          page,
          limit,
        );
        itemList = result.itemList;
        totalCount = result.totalCount;
        break;
      }
      case 'like': {
        const result = await this.actionService.getLikedBoards(userId, page, limit);
        itemList = result.itemList;
        totalCount = result.totalCount;
        break;
      }
      case 'hide': {
        const result = await this.actionService.getHiddenBoards(userId, page, limit);
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

  // 좋아요 누른 게시물
  @Get('/like')
  @UseGuards(JwtAuthGuard)
  async getLikedBoards(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
  ): Promise<InfiniteQueryResponse<BoardActionResponseDto>> {
    const { userId } = req.user as UserPayload;
    [page, limit] = [Number(page), Number(limit)];
    const { itemList, totalCount } = await this.actionService.getLikedBoards(userId, page, limit);
    const { success, data, error } = z.array(BoardActionResponseSchema).safeParse(itemList);
    if (!success) {
      throw new BadRequestException('게시판 응답 데이터 검증 실패', error);
    }
    const hasNextPage = page * limit < totalCount;
    return { itemList: data, nextPage: hasNextPage ? page + 1 : null, totalCount };
  }
}
