import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models';

@Entity('BOARD')
export class BoardEntity {
  @PrimaryGeneratedColumn()
  boardId: number;

  // 외래키 설정
  @ManyToOne(() => UserEntity, (user) => user.boards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // 카테고리 (예: '공지사항', '자유게시판' 등)
  @Column()
  category: string;

  // 글 제목
  @Column()
  title: string;

  // 글 내용
  @Column()
  content: string;

  // 글 이미지 URL (nullable)
  @Column({ nullable: true })
  imageUrl: string;

  // 조회수
  @Column({ default: 0 })
  views: number;

  // 좋아요 수
  @Column({ default: 0 })
  likes: number;

  // 게시글 상태 (예: 'active', 'inactive', 'deleted' 등)
  @Column({ default: 'active' })
  status: string;

  // 게시글 시작일과 종료일 (예: 이벤트 게시글의 경우)
  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;
}
