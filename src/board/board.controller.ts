import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
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
    const addCommentCount = await Promise.all(
      boardList.map(async (board) => {
        const commentCount = await this.commonService.countCommentListByTarget(
          board.boardId,
          'board',
        );
        return { ...board, commentCount };
      }),
    );
    const validateBoardList = addCommentCount
      .map((board) => BoardResponseSchema.safeParse(board))
      .filter((result) => result.success)
      .map((result) => result.data);
    const totalCount = await this.boardService.countBoardsByCategory(category);
    const hasNextPage = page * limit < totalCount;
    return { itemList: validateBoardList, nextPage: hasNextPage ? page + 1 : null, totalCount };
  }

  // 게시판 생성
  @UseInterceptors(FileInterceptor('thumbnailImage'))
  @Post('/')
  async createBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() boardCreateDto: BoardCreateDto,
  ): Promise<void> {
    const validatedData = BoardCreateSchema.parse(boardCreateDto);
    const boardEntity = await this.boardService.createBoard(validatedData);
    if (file) {
      await this.boardService.uploadThumbnailImage(file, boardEntity.boardId);
    }
  }

  // 댓글 생성
  @Post('/comment')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Req() req: Request,
    @Body() commentCreateDto: CommentCreateDto,
  ): Promise<void> {
    const { userId } = req.user as UserPayload;
    const validateRequest = CommentCreateSchema.safeParse(commentCreateDto);
    if (!validateRequest.success) {
      this.logger.warn('댓글 생성 요청 데이터 검증 실패', validateRequest.error);
      throw new Error('Invalid comment data');
    }
    await this.commonService.createComment(commentCreateDto, userId);
  }

  // 댓글 목록 조회
  @Get('/comment')
  async getComments(
    @Query('boardId') boardId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<InfiniteQueryResponse<CommentResponseDto>> {
    page = Number(page);
    limit = Number(limit);
    const commentList = await this.commonService.getCommentListByTarget(
      boardId,
      'board',
      page,
      limit,
    );
    const validateCommentList = commentList
      .map((comment) => CommentResponseSchema.safeParse(comment))
      .filter((result) => result.success)
      .map((result) => result.data);
    const totalCount = await this.commonService.countCommentListByTarget(boardId, 'board');
    const hasNextPage = page * limit < totalCount;
    return {
      itemList: validateCommentList,
      nextPage: hasNextPage ? page + 1 : null,
      totalCount,
    };
  }
}
