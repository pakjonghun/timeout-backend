import { IsDate, IsEnum, IsOptional, min } from 'class-validator';
import { Common } from '../../common/entities/common.entity';
import { User } from '../../user/entities/user.entity';
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

  @Column({ nullable: true, default: null })
  start: string;

  @Column({ nullable: true, default: null })
  end: string;

  @BeforeInsert()
  @BeforeUpdate()
  @AfterLoad()
  setDate() {
    const temp = this.startTime;
    const year = temp.getFullYear();
    const month = temp.getMonth();
    const date = temp.getDate();

    const m = month < 10 ? `0${month}` : month;
    const d = date < 10 ? `0${date}` : date;

    this.date = `${year}-${m}-${d}`;
  }

  @BeforeUpdate()
  @BeforeInsert()
  @AfterLoad()
  setStart() {
    const hours = this.startTime.getHours();
    const minute = this.startTime.getMinutes();
    const h = hours < 10 ? `0${hours}` : hours + '';
    const m = minute < 10 ? `0${minute}` : minute + '';
    this.start = `${h}:${m}`;
  }

  @BeforeUpdate()
  @BeforeInsert()
  @AfterLoad()
  setEnd() {
    if (!this.endTime) return;
    const hours = this.endTime.getHours();
    const minute = this.endTime.getMinutes();
    const h = hours < 10 ? `0${hours}` : hours + '';
    const m = minute < 10 ? `0${minute}` : minute + '';
    this.end = `${h}:${m}`;
  }

  @BeforeUpdate()
  @BeforeInsert()
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
