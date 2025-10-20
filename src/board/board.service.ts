import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from './models';
import { Repository } from 'typeorm';
import type { BoardCreateDto } from './dto/board.dto';
import { ConfigService } from '@nestjs/config';
import { saveFileToDist } from '../common/utils';
import { UserService } from '../user/user.service';
import { CommonService } from '../common/common.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {}

  // 게시판 목록 조회 (카테고리별, 페이징)
  async selectBoardList(
    category: string,
    page: number,
    limit: number,
  ): Promise<(BoardEntity & { commentCount: number })[]> {
    // 게시판 목록 조회
    const boardList = await this.boardRepository.find({
      where: { category, status: 'active' },
      relations: ['user'],
      order: { createDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    // 각 게시판에 댓글 개수 추가
    return await Promise.all(
      boardList.map(async (board) => {
        // 댓글 개수 조회
        const commentCount = await this.commonService.countCommentListByTarget(
          board.boardId,
          'board',
        );
        return { ...board, commentCount };
      }),
    );
  }

  // 게시판 전체 개수 조회 (카테고리별)
  async countBoardsByCategory(category: string): Promise<number> {
    return await this.boardRepository.count({
      where: { category, status: 'active' },
    });
  }

  // 게시판 생성
  async createBoard(boardCreateDto: BoardCreateDto, userId: number): Promise<BoardEntity> {
    const user = await this.userService.findUserById(userId);
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

  // 게시판 상세 조회
  async getBoardById(boardId: number): Promise<BoardEntity | null> {
    return await this.boardRepository.findOne({
      where: { boardId, status: 'active' },
      relations: ['user'],
    });
  }

  // 게시판 수정
  async updateBoard(boardUpdateDto: BoardCreateDto, boardId: number): Promise<void> {
    await this.boardRepository.update({ boardId }, { ...boardUpdateDto });
  }

  // 썸네일 이미지 업로드
  async uploadThumbnailImage(file: Express.Multer.File, boardId: number): Promise<void> {
    const filePath = saveFileToDist(file, 'board/' + boardId);
    const baseurl = this.configService.get<string>('BASE_URL');
    await this.boardRepository.update({ boardId }, { thumbnailImageUrl: baseurl + '/' + filePath });
  }

  /// 게시판 삭제
  async deleteBoard(boardId: number, userId: number): Promise<void> {
    const board = await this.getBoardById(boardId);
    if (!board) {
      throw new BadRequestException('존재하지 않는 게시판입니다.');
    }
    if (board.user.userId !== userId) {
      throw new ForbiddenException('게시판 삭제 권한이 없습니다.');
    }
    // 상태를 'deleted'로 변경하고 삭제 일자 기록
    await this.boardRepository.update({ boardId }, { status: 'deleted', deleteDate: new Date() });
  }
}
