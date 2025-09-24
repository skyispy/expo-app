import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from './models';
import { Repository } from 'typeorm';
import type { BoardCreateDto } from './dto/board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  async selectBoards(category: string): Promise<BoardEntity[]> {
    return await this.boardRepository.find({
      where: { category, status: 'active' },
      relations: ['user'],
    });
  }

  // 게시판 생성
  async createBoard(boardData: BoardCreateDto): Promise<void> {
    const newBoard = this.boardRepository.create(boardData);
    await this.boardRepository.save(newBoard);
  }
}
