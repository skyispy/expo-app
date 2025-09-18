import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from './models';
import { Repository } from 'typeorm';

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
}
