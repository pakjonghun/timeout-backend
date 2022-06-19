import { IsOptional, IsString, Matches } from 'class-validator';
import { PagnationDto } from 'src/common/dtos/pagnation.dto';

type Sort = 'ASC' | 'DESC';

export class GetMyRecordsDto extends PagnationDto {
  @IsOptional()
  @Matches(/[(ASC)(DESC)]/, { message: '정렬 값은 ASC 나 DESC 입니다.' })
  sortValue?: Sort;

  @IsOptional()
  @IsString({ message: '정렬 키는 문자열 입니다.' })
  sortKey?: string;
}
