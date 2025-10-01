import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BoardService } from './board.service';
import type { BoardCreateDto, BoardResponseDto } from './dto/board.dto';
import { BoardCreateSchema, BoardResponseSchema } from './dto/board.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  private readonly logger = new Logger(BoardController.name);

  @Get('/')
  async getBoards(
    @Query('category') category: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ boardList: BoardResponseDto[]; nextPage: number | null }> {
    this.logger.log('Get /board 요청');
    page = Number(page);
    limit = Number(limit);
    const boardList = await this.boardService.selectBoardList(category, page, limit);
    const validateBoardList = boardList
      // 댓글 수 추가 및 응답 형식 변환
      .map(({ comments, ...board }) => ({
        ...board,
        commentCount: comments?.length ?? 0,
      }))
      // zod으로 유효성 검사
      .map((board) => BoardResponseSchema.safeParse(board))
      .filter((result) => result.success)
      .map((result) => result.data);
    const totalCount = await this.boardService.countBoardsByCategory(category);
    const hasNextPage = page * limit < totalCount;
    return { boardList: validateBoardList, nextPage: hasNextPage ? page + 1 : null };
  }

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
}
