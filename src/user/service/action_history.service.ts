import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionHistoryEntity } from '../models';
import { Repository } from 'typeorm';
import { UserService } from './user.service';

@Injectable()
export class ActionHistoryService {
  constructor(
    @InjectRepository(ActionHistoryEntity)
    private readonly actionHistoryRepository: Repository<ActionHistoryEntity>,
    private readonly userService: UserService,
  ) {}

  private readonly loger = new Logger(ActionHistoryService.name);

  // 행동 기록 조회
  async getActionHistoryByUser(targetType: string, userId: number): Promise<ActionHistoryEntity[]> {
    return await this.actionHistoryRepository.find({
      where: { targetType, user: { userId } },
      order: { updateDate: 'DESC' },
    });
  }

  // 행동 기록 수 조회
  async countActionHistoryByTarget(targetType: string, targetId: number): Promise<number> {
    return await this.actionHistoryRepository.count({
      where: { targetType, targetId },
    });
  }

  // 조회 기록 추가
  async recordViewHistory(targetType: string, targetId: number, userId: number): Promise<void> {
    const existingRecord = await this.actionHistoryRepository.findOne({
      where: { targetType, targetId, user: { userId } },
      order: { updateDate: 'DESC' },
    });
    const thisDate = new Date();
    if (
      existingRecord &&
      thisDate.getTime() - existingRecord.updateDate.getTime() < 24 * 60 * 60 * 1000
    ) {
      // 하루 내에 기록이 존재하면 조회 날짜만 업데이트
      await this.actionHistoryRepository.update(
        { actionHistoryId: existingRecord.actionHistoryId },
        { updateDate: thisDate },
      );
    } else {
      // 새로운 기록 생성
      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new UnauthorizedException('존재하지 않는 사용자입니다.');
      }
      const newRecord = this.actionHistoryRepository.create({
        targetType,
        targetId,
        user,
      });
      await this.actionHistoryRepository.save(newRecord);
    }
  }

  // 기록 조회
  async getActionHistory(
    targetType: string,
    targetId: number,
    userId: number,
  ): Promise<ActionHistoryEntity | null> {
    return await this.actionHistoryRepository.findOne({
      where: { targetType, targetId, user: { userId } },
    });
  }

  // 기록 추가
  async recordActionHistory(targetType: string, targetId: number, userId: number): Promise<void> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    const newRecord = this.actionHistoryRepository.create({
      targetType,
      targetId,
      user,
    });
    await this.actionHistoryRepository.save(newRecord);
  }

  // 기록 삭제
  async removeActionHistory(targetType: string, targetId: number, userId: number): Promise<void> {
    const existingRecord = await this.actionHistoryRepository.findOne({
      where: { targetType, targetId, user: { userId } },
    });
    if (!existingRecord) {
      this.loger.warn('존재하지 않는 기록입니다.');
      return;
    }
    await this.actionHistoryRepository.delete({ actionHistoryId: existingRecord.actionHistoryId });
  }
}
