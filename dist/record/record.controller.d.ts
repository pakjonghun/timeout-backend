import { UpdateRecordDto } from './dto/updateRecords.dto';
import { GetMyRecordsDto } from './dto/getMyRecord.dto';
import { EndRecordDto } from './dto/endRecord.dto';
import { RecordService } from './record.service';
import { StartRecordDto } from './dto/startRecord.dto';
import { MyInfoDto } from '../user/decorators/myInfo.dto';
import { EventGateway } from '../event/event.gateway';
export declare class RecordController {
    private readonly recordService;
    private readonly eventGateway;
    constructor(recordService: RecordService, eventGateway: EventGateway);
    startRecord(startRecordDto: StartRecordDto, user: MyInfoDto): Promise<import("./entities/record.entity").Record>;
    update(endRecordDto: EndRecordDto, user: MyInfoDto): Promise<import("./entities/record.entity").Record>;
    getMyRecords(getMyRecordsDto: GetMyRecordsDto, user: MyInfoDto): Promise<{
        data: import("./entities/record.entity").Record[];
        totalCount: number;
        totalPage: number;
    }>;
    updateRecords(id: number, updateRecordDto: UpdateRecordDto): Promise<void>;
    removeMany(ids: string): Promise<void>;
    removeRecord(id: number): Promise<void>;
    getTodayList(getMyRecordsDto: GetMyRecordsDto): Promise<{
        data: import("./entities/record.entity").Record[];
        totalCount: number;
        totalPage: number;
    }>;
}
