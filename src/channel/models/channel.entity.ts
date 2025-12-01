import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoryEntity } from '../../board/models/category.entity';
import { TimestampEntity } from '../../common/models';

@Entity('CHANNEL')
export class ChannelEntity extends TimestampEntity {
  // 채널 고유 ID
  @PrimaryGeneratedColumn()
  channelId: number;

  // 채널 이름
  @Column()
  channelName: string;

  // 채널 설명
  @Column({ nullable: true })
  description: string;

  // 채널 이미지 URL
  @Column({ nullable: true })
  channelImageUrl: string;

  // 채널 상태 (예: 'active', 'inactive', 'deleted' 등)
  @Column({ default: 'active' })
  status: string;

  // 채널 카테고리 목록
  @OneToMany(() => CategoryEntity, (category) => category.channel)
  categoryList: CategoryEntity[];
}
