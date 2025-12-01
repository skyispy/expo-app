import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HiddenEntity, LikeEntity, ViewHistoryEntity } from './models';
import { Repository } from 'typeorm';
import { BoardEntity } from '../board/models';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(ViewHistoryEntity)
    private readonly viewHistoryRepository: Repository<ViewHistoryEntity>,
    @InjectRepository(LikeEntity)
    private readonly likeRepository: Repository<LikeEntity>,
    @InjectRepository(HiddenEntity)
    private readonly hiddenRepository: Repository<HiddenEntity>,
  ) {}

  // 조회 기록 추가
  async addView(targetType: string, targetId: number, userId: number): Promise<void> {
    // 하루 이내에 기록이 있으면 updateDate만 갱신
    const existingView = await this.viewHistoryRepository.findOne({
      where: { targetType, targetId, user: { userId } },
    });
    if (existingView) {
      existingView.updateDate = new Date();
      await this.viewHistoryRepository.save(existingView);
    } else {
      const newView = this.viewHistoryRepository.create({
        targetType,
        targetId,
        user: { userId },
      });
      await this.viewHistoryRepository.save(newView);
    }
  }

  // 조회 기록 개수 조회
  async countViews(targetType: string, targetId: number): Promise<number> {
    return await this.viewHistoryRepository.count({
      where: { targetType, targetId },
    });
  }

  // 최근에 본 게시물 조회
  async getRecentBoards(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ itemList: (BoardEntity & { lastActionDate: Date })[]; totalCount: number }> {
    const distinctSubQuery = this.viewHistoryRepository
      .createQueryBuilder('v')
      .select('DISTINCT v.targetId')
      .addSelect('MAX(v.updateDate)', 'lastActionDate')
      .where('v.userId = :userId', { userId })
      .andWhere('v.targetType = :targetType', { targetType: 'board' })
      .groupBy('v.targetId');

    const qb = this.boardRepository
      .createQueryBuilder('board')
      .innerJoinAndSelect('board.user', 'boardUser')
      .innerJoinAndSelect('board.category', 'boardCategory')
      .addSelect('vh.lastActionDate', 'lastActionDate')
      .innerJoin(`(` + distinctSubQuery.getQuery() + `)`, 'vh', 'vh.targetId = board.boardId')
      .setParameters(distinctSubQuery.getParameters())
      .orderBy('lastActionDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const { entities, raw } = await qb.getRawAndEntities();
    const itemList = entities.map((board, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const lastActionDate = raw[index].lastActionDate as Date;
      return { ...board, lastActionDate };
    });
    const totalCount = await distinctSubQuery.getCount();
    return { itemList, totalCount };
  }

  // 좋아요 추가
  async addLike(targetType: string, targetId: number, userId: number): Promise<LikeEntity> {
    const newLike = this.likeRepository.create({
      targetType,
      targetId,
      user: { userId },
    });
    return await this.likeRepository.save(newLike);
  }

  // 좋아요 제거
  async removeLike(targetType: string, targetId: number, userId: number): Promise<void> {
    await this.likeRepository.delete({
      targetType,
      targetId,
      user: { userId },
    });
  }

  // 좋아요 개수 조회
  async countLikes(targetType: string, targetId: number): Promise<number> {
    return await this.likeRepository.count({
      where: { targetType, targetId },
    });
  }

  // 좋아요 누른 게시물 조회
  async getLikedBoards(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ itemList: (BoardEntity & { lastActionDate: Date })[]; totalCount: number }> {
    const distinctSubQuery = this.likeRepository
      .createQueryBuilder('l')
      .select('DISTINCT l.targetId')
      .addSelect('MAX(l.createDate)', 'lastActionDate')
      .where('l.userId = :userId', { userId })
      .andWhere('l.targetType = :targetType', { targetType: 'board' })
      .groupBy('l.targetId');

    const qb = this.boardRepository
      .createQueryBuilder('board')
      .innerJoinAndSelect('board.user', 'boardUser')
      .innerJoinAndSelect('board.category', 'boardCategory')
      .addSelect('lk.lastActionDate', 'lastActionDate')
      .innerJoin('(' + distinctSubQuery.getQuery() + ')', 'lk', 'lk.targetId = board.boardId')
      .setParameters(distinctSubQuery.getParameters())
      .orderBy('lastActionDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const { entities, raw } = await qb.getRawAndEntities();
    const itemList = entities.map((board, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const lastActionDate = raw[index].lastActionDate as Date;
      return { ...board, lastActionDate };
    });
    const totalCount = await distinctSubQuery.getCount();
    return { itemList, totalCount };
  }

  // 좋아요 여부 확인
  async isLiked(targetType: string, targetId: number, userId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { targetType, targetId, user: { userId } },
    });
    return !!like;
  }

  // 숨김 추가
  async addHide(targetType: string, targetId: number, userId: number): Promise<HiddenEntity> {
    const newHide = this.hiddenRepository.create({
      targetType,
      targetId,
      user: { userId },
    });
    return await this.hiddenRepository.save(newHide);
  }

  // 숨김 제거
  async removeHide(targetType: string, targetId: number, userId: number): Promise<void> {
    await this.hiddenRepository.delete({
      targetType,
      targetId,
      user: { userId },
    });
  }

  // 숨김 여부 확인
  async isHidden(targetType: string, targetId: number, userId: number): Promise<boolean> {
    const hide = await this.hiddenRepository.findOne({
      where: { targetType, targetId, user: { userId } },
    });
    return !!hide;
  }

  // 숨긴 게시물 조회
  async getHiddenBoards(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ itemList: (BoardEntity & { lastActionDate: Date })[]; totalCount: number }> {
    const distinctSubQuery = this.hiddenRepository
      .createQueryBuilder('h')
      .select('DISTINCT h.targetId')
      .addSelect('MAX(h.createDate)', 'lastActionDate')
      .where('h.userId = :userId', { userId })
      .andWhere('h.targetType = :targetType', { targetType: 'board' })
      .groupBy('h.targetId');

    const qb = this.boardRepository
      .createQueryBuilder('board')
      .innerJoinAndSelect('board.user', 'boardUser')
      .innerJoinAndSelect('board.category', 'boardCategory')
      .addSelect('hd.lastActionDate', 'lastActionDate')
      .innerJoin('(' + distinctSubQuery.getQuery() + ')', 'hd', 'hd.targetId = board.boardId')
      .setParameters(distinctSubQuery.getParameters())
      .orderBy('lastActionDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const { entities, raw } = await qb.getRawAndEntities();
    const itemList = entities.map((board, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const lastActionDate = raw[index].lastActionDate as Date;
      return { ...board, lastActionDate };
    });
    const totalCount = await distinctSubQuery.getCount();
    return { itemList, totalCount };
  }
}
