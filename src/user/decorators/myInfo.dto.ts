import { Record } from 'src/record/entities/record.entity';
import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

class MyInfoRecordDto extends PickType(Record, [
  'id',
  'startTime',
  'endTime',
  'description',
]) {}

export class MyInfoDto extends PickType(User, ['id', 'role']) {
  record: MyInfoRecordDto;
}
