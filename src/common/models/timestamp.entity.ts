import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class TimestampEntity {
  // 생성 일자
  @CreateDateColumn({ type: 'datetime' })
  createDate: Date;

  // 수정 일자
  @UpdateDateColumn({ type: 'datetime' })
  updateDate: Date;

  // 삭제 일자
  @DeleteDateColumn({
    type: 'datetime',
    nullable: true,
  })
  deleteDate: Date | null;
}
