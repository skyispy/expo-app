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
    return await this.channelRepository.find({
      where: { status: 'active', categoryList: { status: 'active' } },
      relations: ['categoryList'],
      order: { channelId: 'ASC', categoryList: { categoryId: 'ASC' } },
    });
  }
}
