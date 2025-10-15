import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models';

@Entity('LIKE')
export class LikeEntity {
  @PrimaryGeneratedColumn()
  likeId: number;

  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // 좋아요 누른 게시글 ID
}