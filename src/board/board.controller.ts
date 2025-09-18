import { Controller, Get, Logger, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardResponseDto } from './dto/board.dto';
import { BoardResponseSchema } from './dto/board.schema';
import { z } from 'zod';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  private readonly logger = new Logger(BoardController.name);

  @Get('/')
  async getBoards(@Query('category') category: string): Promise<BoardResponseDto[]> {
    this.logger.log('Get /board 요청');
    const boards = await this.boardService.selectBoards(category);
    return z.array(BoardResponseSchema).parse(boards);
  }
}
