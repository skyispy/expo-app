import { Body, Controller, Get, Logger, Post, Query, UsePipes } from '@nestjs/common';
import { BoardService } from './board.service';
import type { BoardCreateDto, BoardResponseDto } from './dto/board.dto';
import { BoardResponseSchema, BoardCreateSchema } from './dto/board.schema';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/pipes';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  private readonly logger = new Logger(BoardController.name);

  @Get('/')
  async getBoards(@Query('category') category: string): Promise<BoardResponseDto[]> {
    this.logger.log('Get /board 요청');
    const boards = await this.boardService.selectBoards(category);
    // 댓글 수 추가
    const result = boards.map(({ comments, ...board }) => ({
      ...board,
      commentCount: comments?.length,
    }));
    return z.array(BoardResponseSchema).parse(result);
  }

  @UsePipes(new ZodValidationPipe(BoardCreateSchema))
  @Post('/create')
  async createBoard(@Body() boardCreateDto: BoardCreateDto): Promise<void> {
    await this.boardService.createBoard(boardCreateDto);
  }
}
