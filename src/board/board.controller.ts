import {
  BadRequestException,
  Body,
  Controller,
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
import type { CommentResponseDto, CommentCreateDto } from '../common/dto/comment.dto';
import { CommentCreateSchema, CommentResponseSchema } from '../common/dto/comment.schema';
import { InfiniteQueryResponse } from '../common/dto/response.dto';
import { JwtAuthGuard, UserPayload } from '../auth/guards';
import type { Request } from 'express';
import { CommonService } from '../common/common.service';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly commonService: CommonService,
  ) {}
  private readonly logger = new Logger(BoardController.name);

  @Get('/')
  async getBoards(
    @Query('category') category: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<InfiniteQueryResponse<BoardResponseDto>> {
    this.logger.log(`게시판 ${category} ${page}페이지`);
    page = Number(page);
    limit = Number(limit);
    const boardList = await this.boardService.selectBoardList(category, page, limit);
    const validateBoardList = boardList
      .map((board) => BoardResponseSchema.safeParse(board))
      .filter((result) => result.success)
      .map((result) => result.data);
    const totalCount = await this.boardService.countBoardsByCategory(category);
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
  async getBoard(@Param('boardId') boardId: number): Promise<{ result: BoardResponseDto }> {
    const board = await this.boardService.getBoardById(boardId);
    const { data, success, error } = BoardResponseSchema.safeParse(board);
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
  ): Promise<{ result: BoardResponseDto }> {
    const validatedRequest = BoardCreateSchema.safeParse(boardUpdateDto);
    if (!validatedRequest.success) {
      this.logger.warn('게시판 수정 요청 데이터 검증 실패', validatedRequest.error);
      throw new BadRequestException(validatedRequest.error.issues[0].message);
    }
    await this.boardService.updateBoard(validatedRequest.data, boardId);
    if (file) {
      await this.boardService.uploadThumbnailImage(file, boardId);
    }
    const board = await this.boardService.getBoardById(boardId);
    const commentCount = await this.commonService.countCommentListByTarget(boardId, 'board');
    const boardWithComment = { ...board, commentCount };
    const { data, success, error } = BoardResponseSchema.safeParse(boardWithComment);
    if (!success) {
      this.logger.warn('게시판 수정 응답 데이터 검증 실패', error);
      throw new BadRequestException('게시판 응답 데이터 검증 실패');
    }
    return { result: data };
  }
}
