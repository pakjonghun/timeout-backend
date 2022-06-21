import { Common } from '../../common/entities/common.entity';
import { User } from '../../user/entities/user.entity';
declare enum Status {
    'working' = "working",
    'done' = "done",
    'notning' = "nothing"
}
declare type StatusType = keyof typeof Status;
export declare class Record extends Common {
    startTime: Date;
    endTime: Date;
    description: string;
    user: User;
    status: StatusType;
    duration: number;
    date: string;
    start: string;
    end: string;
    setDate(): void;
    setStart(): void;
    setEnd(): void;
    setDuration(): void;
    setStatus(): void;
}
export {};
