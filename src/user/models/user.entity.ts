import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RefreshTokensEntity } from '../../auth/models';

@Entity('USER')
export class UserEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  // RefreshTokensEntity와의 1:N 관계 설정
  @OneToMany(() => RefreshTokensEntity, (refreshToken) => refreshToken.userId)
  refreshTokens: RefreshTokensEntity[];
}
