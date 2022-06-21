import { IsOptional, IsString, Matches } from 'class-validator';
import { PagnationDto } from '../../common/dtos/pagnation.dto';

type Sort = 'ASC' | 'DESC';

export class GetMyRecordsDto extends PagnationDto {
  @IsOptional()
  @Matches(/[(ASC)(DESC)]/, { message: '정렬 값은 ASC 나 DESC 입니다.' })
  sortValue?: Sort;

  @IsOptional()
  @IsString({ message: '정렬 키는 문자열 입니다.' })
  sortKey?: string;

  @IsString({ message: '검색어는 문자열 입니다.' })
  @IsOptional()
  searchTerm?: string;

  @IsString({ message: '검색날짜는 문자열 입니다.' })
  @IsOptional()
  startDate?: string;

  @IsString({ message: '검색날짜는 문자열 입니다.' })
  @IsOptional()
  endDate?: string;
}
