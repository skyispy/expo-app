import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/models';
import { UserEntity } from '../../user/models';

@Entity('HIDDEN')
export class HiddenEntity extends TimestampEntity {
  @PrimaryGeneratedColumn()
  hiddenId: number;

  // 숨김 대상 타입 ('board', 'comment' 등)
  @Column()
  targetType: string;

  // 숨김 대상 ID
  @Column()
  targetId: number;

  // 유저
  @ManyToOne(() => UserEntity, (user) => user.hiddenList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
