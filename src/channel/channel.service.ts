import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from './models';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity) private readonly channelRepository: Repository<ChannelEntity>,
  ) {}

  // 채널 목록 조회
  async selectChannelList(): Promise<ChannelEntity[]> {
    return await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.categoryList', 'categoryList')
      .where('channel.status = :status', { status: 'active' })
      .andWhere('categoryList.status = :status', { status: 'active' })
      .orderBy('channel.channelId', 'ASC')
      .addOrderBy('categoryList.categoryId', 'ASC')
      .getMany();
  }
}
