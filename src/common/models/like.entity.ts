import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models';

@Entity('LIKE')
export class LikeEntity {
  @PrimaryGeneratedColumn()
  likeId: number;

  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  targetType: string; // 'board' 또는 'comment'

  @Column()
  targetId: number; // 좋아요 누른 대상 ID (boardId 또는 commentId)

  // 생성 일자
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;
}