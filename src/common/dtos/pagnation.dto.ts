import { IsNumber, Min } from 'class-validator';

export class PagnationDto {
  @IsNumber({}, { message: '페이지 숫자를 입력하세요' })
  @Min(1, { message: '페이지는 최소 1이상의 숫자를 입력하세요' })
  page: number;

  @IsNumber({}, { message: '페이지별 출력할 데이터의 숫자를 입력하세요' })
  @Min(1, { message: '페이지별 출력할 데이터의 숫자는 최소 1이상 입니다.' })
  perPage: number;
}
