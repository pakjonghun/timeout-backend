import { PagnationDto } from '../../common/dtos/pagnation.dto';
declare type Sort = 'ASC' | 'DESC';
export declare class GetUserRecordsDto extends PagnationDto {
    startTime?: Sort;
    endTime?: Sort;
}
export {};
