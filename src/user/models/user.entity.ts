import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RefreshTokensEntity } from '../../auth/models';
import { BoardEntity } from '../../board/models';
import { CommentEntity, TimestampEntity } from '../../common/models';
import { LikeEntity, HiddenEntity, ViewHistoryEntity } from '../../action/models';

@Entity('USER')
export class UserEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  // 이메일
  @Column()
  email: string;

  // 비밀번호
  @Column()
  password: string;

  // 닉네임
  @Column()
  nickname: string;

  // 프로필 이미지
  @Column({ nullable: true })
  profileImageUrl: string;

  // 자기소개
  @Column({ nullable: true })
  introduction: string;

  // 리프레시 토큰 목록
  @OneToMany(() => RefreshTokensEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokensEntity[];

  // 게시글 목록
  @OneToMany(() => BoardEntity, (board) => board.user)
  boardList: BoardEntity[];

  // 댓글 목록
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  commentList: CommentEntity[];

  // 최근 본 기록 목록
  @OneToMany(() => ViewHistoryEntity, (viewHistory) => viewHistory.user)
  viewHistoryList: ViewHistoryEntity[];

  // 좋아요 목록
  @OneToMany(() => LikeEntity, (like) => like.user)
  likeList: LikeEntity[];

  // 숨김 목록
  @OneToMany(() => HiddenEntity, (hidden) => hidden.user)
  hiddenList: HiddenEntity[];
}
