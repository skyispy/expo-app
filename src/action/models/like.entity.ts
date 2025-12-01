import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models';
import { TimestampEntity } from '../../common/models';

@Entity('LIKE')
export class LikeEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  likeId: number;

  // 좋아요 대상 타입 ('board', 'comment' 등)
  @Column()
  targetType: string;

  // 좋아요 대상 ID
  @Column()
  targetId: number;

  // 유저
  @ManyToOne(() => UserEntity, (user) => user.likeList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
