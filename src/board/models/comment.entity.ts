import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoardEntity } from './board.entity';
import { UserEntity } from '../../user/models';

@Entity('COMMENT')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  commentId: number;

  @ManyToOne(() => BoardEntity, (board) => board.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: BoardEntity;

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
