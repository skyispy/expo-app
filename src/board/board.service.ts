import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity, CommentEntity } from './models';
import { Repository } from 'typeorm';
import type { BoardCreateDto } from './dto/board.dto';
import { ConfigService } from '@nestjs/config';
import { saveFileToDist } from '../common/utils';
import { UserService } from '../user/user.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  // 게시판 목록 조회 (카테고리별, 페이징)
  async selectBoardList(category: string, page: number, limit: number): Promise<BoardEntity[]> {
    return await this.boardRepository.find({
      where: { category, status: 'active' },
      relations: ['user'],
      order: { createDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  // 게시판 전체 개수 조회 (카테고리별)
  async countBoardsByCategory(category: string): Promise<number> {
    return await this.boardRepository.count({
      where: { category, status: 'active' },
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

  // 댓글 개수 조회
  async countCommentListByBoardId(boardId: number): Promise<number> {
    return await this.commentRepository.count({
      where: { targetType: 'board', targetId: boardId },
    });
  }

  // 댓글 목록 조회
  async getCommentListByBoardId(
    boardId: number,
    page: number,
    limit: number,
  ): Promise<CommentEntity[]> {
    return await this.commentRepository.find({
      where: { targetType: 'board', targetId: boardId },
      relations: ['user'],
      order: { createDate: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
