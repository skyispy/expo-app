import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoryEntity } from '../../board/models/category.entity';

@Entity('CHANNEL')
export class ChannelEntity {
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

  // 생성 일자
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  // 수정 일자
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;

  // 삭제 일자
  @Column({ type: 'datetime', nullable: true })
  deleteDate: Date;

  // 채널 카테고리 목록
  @OneToMany(() => CategoryEntity, (category) => category.channel)
  categoryList: CategoryEntity[];
}
