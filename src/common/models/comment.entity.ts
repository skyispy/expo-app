import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models';
import { TimestampEntity } from './timestamp.entity';

@Entity('COMMENT')
export class CommentEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  commentId: number;

  // 댓글 타입
  @Column()
  targetType: string; // 'board' 또는 'comment'

  // 대상 ID (boardId)
  @Column()
  targetId: number;

  // 댓글 작성자
  @ManyToOne(() => UserEntity, (user) => user.commentList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // 댓글 내용
  @Column()
  content: string;

  // 좋아요
  @Column({ default: 0 })
  likes: number;

  // 싫어요
  @Column({ default: 0 })
  dislikes: number;

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
