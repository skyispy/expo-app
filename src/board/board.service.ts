import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from './models';
import { Repository } from 'typeorm';
import type { BoardCreateDto } from './dto/board.dto';
import { ConfigService } from '@nestjs/config';
import { saveFileToDist } from '../common/utils';
import { UserService } from '../user/user.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async selectBoards(category: string): Promise<BoardEntity[]> {
    return await this.boardRepository.find({
      where: { category, status: 'active' },
      relations: ['user'],
      order: { createDate: 'DESC' },
    });
  }

  // 게시판 생성
  async createBoard(boardCreateDto: BoardCreateDto): Promise<BoardEntity> {
    const user = await this.userService.findUserById(boardCreateDto.userId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const newBoard = this.boardRepository.create({
      ...boardCreateDto,
      status: 'active',
      user,
    });
    return await this.boardRepository.save(newBoard);
  }

  // 썸네일 이미지 업로드
  async uploadThumbnailImage(file: Express.Multer.File, boardId: number): Promise<void> {
    const filePath = saveFileToDist(file, 'board/' + boardId);
    const baseurl = this.configService.get<string>('BASE_URL');
    await this.boardRepository.update({ boardId }, { thumbnailImageUrl: baseurl + '/' + filePath });
  }
}
