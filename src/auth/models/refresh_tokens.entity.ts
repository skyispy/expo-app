import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models';
import { TimestampEntity } from '../../common/models';

@Entity('REFRESH_TOKENS')
export class RefreshTokensEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  tokenId: number;

  // 사용자
  @ManyToOne(() => UserEntity, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // 리프레시 토큰
  @Column()
  refreshToken: string;

  // 기기 구분용
  @Column()
  userAgent: string;

  // 만료 일자
  @Column({ type: 'datetime' })
  expiresDate: Date;
}
