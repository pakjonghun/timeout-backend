import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Common } from 'src/common/entities/common.entity';
import { User } from 'src/user/entities/user.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

enum Status {
  'working' = 'working',
  'done' = 'done',
  'notning' = 'nothing',
}

type StatusType = keyof typeof Status;

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

  @Column({ nullable: true, default: 'nothing' })
  @IsEnum(Status)
  status: StatusType;

  @Column({ nullable: true, default: null })
  duration: number;

  @Column({ nullable: true, default: null })
  date: string;

  @BeforeInsert()
  @AfterLoad()
  setDate() {
    this.date = this.startTime.toDateString();
  }

  @BeforeUpdate()
  @AfterLoad()
  setDuration() {
    if (this.endTime == null) this.duration = null;
    else this.duration = this.endTime.getTime() - this.startTime.getTime();
  }

  @BeforeUpdate()
  @BeforeInsert()
  @AfterLoad()
  setStatus() {
    if (this.endTime) this.status = 'done';
    else this.status = 'working';
  }
}
