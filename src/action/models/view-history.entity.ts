import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/models';
import { UserEntity } from '../../user/models';

@Entity('VIEW_HISTORY')
export class ViewHistoryEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  viewId: number;

  // 대상 타입
  @Column()
  targetType: string;

  // 대상 ID
  @Column()
  targetId: number;

  // 사용자
  @ManyToOne(() => UserEntity, (user) => user.viewHistoryList)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
