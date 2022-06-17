import { GetMyRecordsDto } from './dto/getMyRecord.dto';
import { Record } from 'src/record/entities/record.entity';
import { Injectable } from '@nestjs/common';
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
    return this.recordRepository.save({
      user: { id: userId },
      ...startRecordDto,
    });
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
    return this.recordRepository.save({
      id,
      ...body,
    });
  }

  async findMyRecords(
    userId: number,
    { page, perPage, ...sort }: GetMyRecordsDto,
  ) {
    const keys = Object.keys(sort);

    const tempQuery = this.recordRepository
      .createQueryBuilder('r')
      .select(['r.id', 'r.startTime', 'r.endTime', 'r.description'])
      .innerJoin('r.user', 'u')
      .where('u.id=:id', { id: userId })
      .take(perPage)
      .skip((page - 1) * perPage);

    const [data, totalCount] = keys.length
      ? await tempQuery.orderBy(`r.${keys[0]}`, sort[keys[0]]).getManyAndCount()
      : await tempQuery.getManyAndCount();

    return {
      data,
      totalCount,
      totalPage: Math.ceil(totalCount / perPage),
      message: 'success',
    };
  }

  async findAllRecords({ page, perPage, ...sort }: GetMyRecordsDto) {
    const keys = Object.keys(sort);
    const tempQuery = this.recordRepository
      .createQueryBuilder('r')
      .select([
        'r.id',
        'r.startTime',
        'r.endTime',
        'r.description',
        'u.id',
        'u.name',
      ])
      .innerJoin('r.user', 'u')
      .take(perPage)
      .skip((page - 1) * perPage);

    const [data, totalCount] = keys.length
      ? await tempQuery.orderBy(`r.${keys[0]}`, sort[keys[0]]).getManyAndCount()
      : await tempQuery.getManyAndCount();

    return {
      data,
      totalCount,
      totalPage: Math.ceil(totalCount / perPage),
      message: 'success',
    };
  }
}
