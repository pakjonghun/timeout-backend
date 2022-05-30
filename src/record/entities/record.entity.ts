import { IsDate, IsOptional } from 'class-validator';
import { Common } from 'src/common/entities/common.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Record extends Common {
  @Column()
  @IsDate({ message: '시작시간은 날짜를 입력하세요' })
  startTime: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsDate({ message: '종료시간은 날짜를 입력하세요' })
  endTime: Date;

  @Column({ nullable: true, default: '초과근무' })
  @IsOptional()
  description: string;

  @ManyToOne(() => User, (user) => user.recordList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
