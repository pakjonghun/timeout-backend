import { Record } from '../../record/entities/record.entity';
import { User } from '../entities/user.entity';
declare const MyInfoRecordDto_base: import("@nestjs/common").Type<Pick<Record, "id" | "startTime" | "endTime" | "description">>;
declare class MyInfoRecordDto extends MyInfoRecordDto_base {
}
declare const MyInfoDto_base: import("@nestjs/common").Type<Pick<User, "id" | "role">>;
export declare class MyInfoDto extends MyInfoDto_base {
    recordList: MyInfoRecordDto;
}
export {};
