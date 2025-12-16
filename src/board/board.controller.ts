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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardService } from './board.service';
import type { BoardCreateDto, BoardResponseDto } from './dto/board.dto';
import { BoardCreateSchema, BoardResponseSchema } from './dto/board.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { InfiniteQueryResponse } from '../common/dto/response.dto';
import { JwtAuthGuard } from '../auth/guards';
import type { Request } from 'express';
import { ActionService } from '../action/action.service';
import type { UserPayload } from '../common/types';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly actionService: ActionService,
  ) {}
  private readonly logger = new Logger(BoardController.name);

  // 게시판 목록 조회
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getBoards(
    @Query('categoryId') categoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request,
  ): Promise<InfiniteQueryResponse<BoardResponseDto>> {
    const { userId } = req.user as UserPayload;
    categoryId = Number(categoryId);
    page = Number(page);
    limit = Number(limit);
    const totalCount = await this.boardService.countBoardsByCategoryId(categoryId);
    const boardList = await this.boardService.selectBoardList(userId, categoryId, page, limit);
    const categoryName = await this.boardService.getCategoryNameById(categoryId);
    this.logger.log(
      `게시판 목록 조회 - ${categoryName}, ${page}/${Math.ceil(totalCount / limit)}, 총 게시판 수 : ${totalCount}`,
    );
    const validateBoardList = boardList
      .map((board) => BoardResponseSchema.safeParse(board))
      .filter((result) => result.success)
      .map((result) => result.data);
    const hasNextPage = page * limit < totalCount;
    return { itemList: validateBoardList, nextPage: hasNextPage ? page + 1 : null, totalCount };
  }

  // 게시판 생성
  @Post('/')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnailImage'))
  async createBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() boardCreateDto: BoardCreateDto,
    @Req() req: Request,
  ): Promise<void> {
    const validatedRequest = BoardCreateSchema.safeParse(boardCreateDto);
    if (!validatedRequest.success) {
      this.logger.warn('게시판 생성 요청 데이터 검증 실패', validatedRequest.error);
      throw new BadRequestException(validatedRequest.error.issues[0].message);
    }
    const { userId } = req.user as UserPayload;
    const boardEntity = await this.boardService.createBoard(validatedRequest.data, userId);
    if (file) {
      await this.boardService.uploadThumbnailImage(file, boardEntity.boardId);
    }
  }

  // 게시판 상세 조회
  @Get('/:boardId')
  @UseGuards(JwtAuthGuard)
  async getBoard(
    @Param('boardId') boardId: number,
    @Req() req: Request,
  ): Promise<{ result: BoardResponseDto }> {
    const { userId } = req.user as UserPayload;
    const board = await this.boardService.getBoardDetail(boardId, userId);
    const extraInfo = await this.boardService.getBoardExtraInfo(boardId, userId);
    const { data, success, error } = BoardResponseSchema.safeParse({ ...board, ...extraInfo });
    if (!success) {
      this.logger.warn('게시판 상세 응답 데이터 검증 실패', error);
      throw new BadRequestException('게시판 응답 데이터 검증 실패');
    }
    return { result: data };
  }

  // 게시판 수정
  @Put('/:boardId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnailImage'))
  async updateBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() boardUpdateDto: BoardCreateDto,
    @Param('boardId') boardId: number,
  ): Promise<void> {
    const validatedRequest = BoardCreateSchema.safeParse(boardUpdateDto);
    if (!validatedRequest.success) {
      this.logger.warn('게시판 수정 요청 데이터 검증 실패', validatedRequest.error);
      throw new BadRequestException(validatedRequest.error.issues[0].message);
    }
    await this.boardService.updateBoard(validatedRequest.data, boardId);
    this.logger.log('게시판 정보 수정 완료: ' + boardId);
    if (file) {
      await this.boardService.uploadThumbnailImage(file, boardId);
    }
  }

  // 게시판 삭제
  @Delete('/:boardId')
  @UseGuards(JwtAuthGuard)
  async deleteBoard(@Param('boardId') boardId: number, @Req() req: Request): Promise<void> {
    const { userId } = req.user as UserPayload;
    await this.boardService.deleteBoard(boardId, userId);
  }

  // 좋아요/숨기기/신고/차단 추가
  @Post('/:boardId/:actionType')
  @UseGuards(JwtAuthGuard)
  async addAction(
    @Param('boardId') boardId: number,
    @Param('actionType') actionType: 'like' | 'hide' | 'report' | 'block',
    @Req() req: Request,
  ): Promise<void> {
    const { userId } = req.user as UserPayload;
    switch (actionType) {
      case 'like':
        await this.actionService.addLike('board', boardId, userId);
        break;
      case 'hide':
        await this.actionService.addHide('board', boardId, userId);
        break;
      // 추가적인 action 타입 처리 가능
      default:
        throw new BadRequestException('유효하지 않은 액션 타입입니다.');
    }
  }

  // 좋아요/숨기기/신고/차단 제거
  @Delete('/:boardId/:action')
  @UseGuards(JwtAuthGuard)
  async removeAction(
    @Param('boardId') boardId: number,
    @Param('action') action: 'like' | 'hide' | 'report' | 'block',
    @Req() req: Request,
  ): Promise<void> {
    const { userId } = req.user as UserPayload;
    switch (action) {
      case 'like':
        await this.actionService.removeLike('board', boardId, userId);
        break;
      case 'hide':
        await this.actionService.removeHide('board', boardId, userId);
        break;
      // 추가적인 action 타입 처리 가능
      default:
        throw new BadRequestException('유효하지 않은 액션 타입입니다.');
    }
  }
}
