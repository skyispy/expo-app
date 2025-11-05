import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from './models';
import { Repository } from 'typeorm';
import type { BoardCreateDto } from './dto/board.dto';
import { ConfigService } from '@nestjs/config';
import { saveFileToDist } from '../common/utils';
import { UserService } from '../user/service/user.service';
import { CommonService } from '../common/common.service';
import { CategoryEntity } from './models/category.entity';
import { ActionHistoryService } from '../user/service/action_history.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
    private readonly actionHistoryService: ActionHistoryService,
  ) {}

  private readonly logger = new Logger(BoardService.name);

  // 게시판 목록 조회 (카테고리별, 페이징)
  async selectBoardList(
    userId: number,
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<
    (BoardEntity & { commentCount: number; views: number; likes: number; isLiked: boolean })[]
  > {
    // 게시판 목록 조회
    const boardList = await this.boardRepository.find({
      where: { category: { categoryId }, status: 'active' },
      relations: ['user', 'category'],
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
        // 조회수 조회
        const views = await this.actionHistoryService.countActionHistoryByTarget(
          'board_view',
          board.boardId,
        );
        // 좋아요 수 조회
        const likes = await this.actionHistoryService.countActionHistoryByTarget(
          'board_like',
          board.boardId,
        );
        // 좋아요 여부
        const userLiked = await this.actionHistoryService.getActionHistory(
          'board_like',
          board.boardId,
          userId,
        );
        return { ...board, commentCount, views, likes, isLiked: !!userLiked };
      }),
    );
  }

  // 카테고리 이름 조회
  async getCategoryNameById(categoryId: number): Promise<string | null> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
    });
    return category ? category.categoryName : null;
  }

  // 게시판 전체 개수 조회 (카테고리별)
  async countBoardsByCategoryId(categoryId: number): Promise<number> {
    return await this.boardRepository.count({
      where: { category: { categoryId }, status: 'active' },
    });
  }

  // 게시판 생성
  async createBoard(boardCreateDto: BoardCreateDto, userId: number): Promise<BoardEntity> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const category = await this.categoryRepository.findOne({
      where: { categoryId: boardCreateDto.categoryId, status: 'active' },
    });
    if (!category) {
      throw new BadRequestException('유효하지 않은 카테고리입니다.');
    }
    const newBoard = this.boardRepository.create({
      ...boardCreateDto,
      status: 'active',
      user,
      category,
    });
    return await this.boardRepository.save(newBoard);
  }

  // 게시판 상세 조회
  async getBoardDetail(
    boardId: number,
    userId: number,
  ): Promise<BoardEntity & { views: number; likes: number; isLiked: boolean }> {
    const board = await this.boardRepository.findOne({
      where: { boardId, status: 'active' },
      relations: ['user', 'category'],
    });
    if (!board) {
      throw new BadRequestException('존재하지 않는 게시판입니다.');
    }
    const views = await this.actionHistoryService.countActionHistoryByTarget('board_view', boardId);
    const likes = await this.actionHistoryService.countActionHistoryByTarget('board_like', boardId);
    const userLiked = await this.actionHistoryService.getActionHistory(
      'board_like',
      boardId,
      userId,
    );
    await this.actionHistoryService.recordViewHistory('board_view', boardId, userId);
    return { ...board, views, likes, isLiked: !!userLiked };
  }

  async getBoardById(boardId: number): Promise<BoardEntity | null> {
    return await this.boardRepository.findOne({
      where: { boardId, status: 'active' },
      relations: ['user', 'category'],
    });
  }

  // 게시판 수정
  async updateBoard(boardUpdateDto: BoardCreateDto, boardId: number): Promise<void> {
    // 카테고리 유효성 검사
    const category = await this.categoryRepository.findOne({
      where: { categoryId: boardUpdateDto.categoryId, status: 'active' },
    });
    if (!category) {
      throw new BadRequestException('유효하지 않은 카테고리입니다.');
    }
    // 필드에 없는 categoryId 제거 후 업데이트
    const { categoryId, ...rest } = boardUpdateDto;
    await this.boardRepository.update({ boardId }, { ...rest, category });
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

  // 좋아요/신고/숨기기 추가
  async handleBoardAction(
    boardId: number,
    userId: number,
    actionType: 'like' | 'report' | 'hide',
  ): Promise<void> {
    const targetType = `board_${actionType}`;
    const existingAction = await this.actionHistoryService.getActionHistory(
      targetType,
      boardId,
      userId,
    );
    if (existingAction) {
      throw new BadRequestException('이미 해당 게시판에 대한 행동을 수행하였습니다.');
    }
    await this.actionHistoryService.recordActionHistory(targetType, boardId, userId);
  }

  // 좋아요/신고/숨기기 취소
  async unHandleBoardAction(
    boardId: number,
    userId: number,
    actionType: 'like' | 'report' | 'hide',
  ): Promise<void> {
    const targetType = `board_${actionType}`;
    const existingAction = await this.actionHistoryService.getActionHistory(
      targetType,
      boardId,
      userId,
    );
    if (!existingAction) {
      throw new BadRequestException('해당 게시판에 대한 행동 기록이 존재하지 않습니다.');
    }
    await this.actionHistoryService.removeActionHistory(targetType, boardId, userId);
  }
}
