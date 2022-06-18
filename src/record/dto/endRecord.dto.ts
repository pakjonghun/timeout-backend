import { PickType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { Record } from '../entities/record.entity';
export class EndRecordDto extends PartialType(PickType(Record, ['endTime'])) {}
