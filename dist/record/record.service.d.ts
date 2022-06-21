import { User } from '../user/entities/user.entity';
import { GetMyRecordsDto } from './dto/getMyRecord.dto';
import { Record } from '../record/entities/record.entity';
import { StartRecordDto } from './dto/startRecord.dto';
import { Repository } from 'typeorm';
import { EndRecordDto } from './dto/endRecord.dto';
export declare class RecordService {
    private readonly recordRepository;
    constructor(recordRepository: Repository<Record>);
    create({ user, endTime, startTime, }: {
        user: User;
        endTime: Date;
        startTime: Date;
    }): Promise<void>;
    startRecord(userId: number, startRecordDto: StartRecordDto): Promise<Record>;
    findRecordById(id: number): Promise<Record>;
    updateRecord(id: number, body: EndRecordDto): Promise<Record>;
    findMyRecords(userId: number, { page, perPage, sortValue, sortKey, endDate, startDate, searchTerm, }: GetMyRecordsDto): Promise<{
        data: Record[];
        totalCount: number;
        totalPage: number;
    }>;
    findAllRecords({ page, perPage, sortValue, sortKey, endDate, searchTerm, startDate, }: GetMyRecordsDto): Promise<{
        data: Record[];
        totalCount: number;
        totalPage: number;
    }>;
    removeRecord({ id }: {
        id: number;
    }): Promise<void>;
    removeRecords(ids: string): Promise<void>;
}
