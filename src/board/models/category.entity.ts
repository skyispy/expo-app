import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoardEntity } from './board.entity';
import { ChannelEntity } from '../../channel/models';
import { TimestampEntity } from '../../common/models';

@Entity('CATEGORY')
export class CategoryEntity extends TimestampEntity {
  // 카테고리 고유 ID
  @PrimaryGeneratedColumn()
  categoryId: number;

  // 카테고리 이름
  @Column()
  categoryName: string;

  // 카테고리 설명
  @Column()
  description: string;

  // 카테고리 상태 (예: 'active', 'inactive', 'deleted' 등)
  @Column({ default: 'active' })
  status: string;

  // 게임과의 다대일 관계 설정
  @ManyToOne(() => ChannelEntity, (channel) => channel.categoryList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: ChannelEntity;

  // 게시판과의 1:N 관계 설정
  @OneToMany(() => BoardEntity, (board) => board.category)
  board: BoardEntity;
}
