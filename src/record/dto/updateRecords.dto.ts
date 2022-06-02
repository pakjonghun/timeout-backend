import { PickType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { Record } from '../entities/record.entity';

export class UpdateRecordDto extends PartialType(
  PickType(Record, ['startTime', 'endTime', 'description']),
) {}
