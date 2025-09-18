import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RefreshTokensEntity } from '../../auth/models';
import { BoardEntity } from '../../board/models';

@Entity('USER')
export class UserEntity {
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

  // 생성일시
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  // 수정일시
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  // RefreshTokensEntity와의 1:N 관계 설정
  @OneToMany(() => RefreshTokensEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokensEntity[];

  // BoardEntity와의 1:N 관계 설정
  @OneToMany(() => BoardEntity, (board) => board.user)
  boards: BoardEntity[];
}
