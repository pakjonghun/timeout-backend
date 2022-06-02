import { IsOptional, Matches } from 'class-validator';
import { PagnationDto } from 'src/common/dtos/pagnation.dto';

type Sort = 'ASC' | 'DESC';

export class GetUserRecordsDto extends PagnationDto {
  @IsOptional()
  @Matches(/[(ASC)(DESC)]/, { message: '정렬 타입은 ASC 나 DESC 입니다.' })
  startTime?: Sort;

  @IsOptional()
  @Matches(/[(ASC)(DESC)]/, { message: '정렬 타입은 ASC 나 DESC 입니다.' })
  endTime?: Sort;
}
