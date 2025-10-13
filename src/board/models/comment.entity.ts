import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoardEntity } from './board.entity';
import { UserEntity } from '../../user/models';

@Entity('COMMENT')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  targetId: number;

  @Column()
  targetType: string; // 'board' 또는 'comment'

  // 댓글 작성자
  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // 댓글 내용
  @Column()
  content: string;

  // 좋아요
  @Column()
  likes: number;

  // 싫어요
  @Column()
  dislikes: number;

  // 댓글 상태
  @Column()
  status: string; // 'active', 'deleted' 등

  // 작성 일자
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  // 수정 일자(댓글 수정 시 수정중 표시)
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;
}
