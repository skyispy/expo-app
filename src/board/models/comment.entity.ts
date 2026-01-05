import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models';
import { TimestampEntity } from '../../common/models';
import { BoardEntity } from './board.entity';

@Entity('COMMENT')
export class CommentEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  commentId: number;

  @ManyToOne(() => BoardEntity, (board) => board.commentList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: BoardEntity;

  // 댓글 작성자
  @ManyToOne(() => UserEntity, (user) => user.commentList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // 댓글 내용
  @Column()
  content: string;

  // 댓글 상태
  @Column({ default: 'active' })
  status: string; // 'active', 'deleted' 등

  // 부모 댓글
  @ManyToOne(() => CommentEntity, (comment) => comment.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentCommentId' })
  parent?: CommentEntity;

  // 대댓글
  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  children?: CommentEntity[];
}
