import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models';

@Entity('COMMENT')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  commentId: number;

  // 댓글 타입
  @Column()
  targetType: string; // 'board' 또는 'comment'

  // 대상 ID (boardId)
  @Column()
  targetId: number;

  // 댓글 작성자
  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
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

  // 삭제 일자
  @Column({ type: 'datetime', nullable: true })
  deleteDate: Date;
}
