import { PartialType } from '@nestjs/swagger';
import { StartRecordDto } from './startRecord.dto';

export class UpdateRecordDto extends PartialType(StartRecordDto) {}
