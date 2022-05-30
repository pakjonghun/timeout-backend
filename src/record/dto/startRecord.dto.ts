import { PickType } from '@nestjs/swagger';
import { Record } from '../entities/record.entity';
export class StartRecordDto extends PickType(Record, [
  'startTime',
  'description',
]) {}
