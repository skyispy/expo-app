import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('ACTION_HISTORY')
export class ActionHistoryEntity {
  @PrimaryGeneratedColumn()
  actionHistoryId: number;

  // 조회 대상 타입 ('board', 'user' 등)
  @Column()
  targetType: string;

  @Column()
  targetId: number;

  @ManyToOne(() => UserEntity, (user) => user.actionHistoryList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // 생성 일자
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  // 수정 일자
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;

  // 삭제 일자
  @Column({
    type: 'datetime',
    nullable: true,
  })
  deleteDate: Date;
}
