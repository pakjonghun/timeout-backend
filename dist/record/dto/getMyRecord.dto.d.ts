import { PagnationDto } from '../../common/dtos/pagnation.dto';
declare type Sort = 'ASC' | 'DESC';
export declare class GetMyRecordsDto extends PagnationDto {
    sortValue?: Sort;
    sortKey?: string;
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
    refetch: number;
}
export {};
