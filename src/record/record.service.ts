import { GetMyRecordsDto } from './dto/getMyRecord.dto';
import { Record } from 'src/record/entities/record.entity';
import {
  ClassSerializerInterceptor,
  Injectable,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { StartRecordDto } from './dto/startRecord.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EndRecordDto } from './dto/endRecord.dto';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async startRecord(userId: number, startRecordDto: StartRecordDto) {
    const tempObj = this.recordRepository.create({
      user: { id: userId },
      ...startRecordDto,
    });
    return this.recordRepository.save(tempObj);
  }

  async findRecordById(id: number) {
    return this.recordRepository
      .createQueryBuilder('r')
      .select('r.id')
      .addSelect(['r.startTime', 'r.endTime', 'r.description'])
      .where('r.id= :id', { id })
      .getOne();
  }

  async updateRecord(id: number, body: EndRecordDto) {
    const isExist = await this.recordRepository.findOne({ id });
    if (!isExist) throw new NotFoundException('없는 기록 입니다.');
    isExist.endTime = body.endTime;
    return this.recordRepository.save(isExist);
  }

  async findMyRecords(
    userId: number,
    { page, perPage, sortValue, sortKey }: GetMyRecordsDto,
  ) {
    const tempQuery = this.recordRepository
      .createQueryBuilder('r')
      .select('r.id', 'id')
      .select([
        'r.id',
        'r.startTime',
        'r.endTime',
        'r.date',
        'r.duration',
        'r.status',
      ])
      .innerJoin('r.user', 'u')
      .where('u.id=:id', { id: userId })
      .take(perPage)
      .skip((page - 1) * perPage);

    const [data, totalCount] =
      sortValue && sortKey
        ? await tempQuery
            .orderBy(`r.${sortKey}`, `${sortValue}`)
            .getManyAndCount()
        : await tempQuery.orderBy('r.startTime', 'DESC').getManyAndCount();

    return {
      data,
      totalCount,
      totalPage: Math.ceil(totalCount / perPage),
      message: 'success',
    };
  }

  async findAllRecords({ page, perPage, sortValue, sortKey }: GetMyRecordsDto) {
    console.log(sortKey, sortValue);
    const tempQuery = this.recordRepository
      .createQueryBuilder('r')
      .select([
        'r.id',
        'r.date',
        'r.startTime',
        'r.endTime',
        'r.description',
        'r.duration',
        'r.status',
        'u.id',
        'u.name',
      ])
      .innerJoin('r.user', 'u')
      .take(perPage)
      .skip((page - 1) * perPage);

    const [data, totalCount] =
      sortValue && sortKey
        ? await tempQuery
            .orderBy(
              `${sortKey == 'userName' ? 'u.name' : 'r.' + sortKey}`,
              sortValue,
            )
            .getManyAndCount()
        : await tempQuery.orderBy('r.startTime', 'DESC').getManyAndCount();

    return {
      data,
      totalCount,
      totalPage: Math.ceil(totalCount / perPage),
      message: 'success',
    };
  }
}
