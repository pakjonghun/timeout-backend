import { User } from '../user/entities/user.entity';
import { GetMyRecordsDto } from './dto/getMyRecord.dto';
import { Record } from '../record/entities/record.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create({
    user,
    endTime,
    startTime,
  }: {
    user: User;
    endTime: Date;
    startTime: Date;
  }) {
    const temp = this.recordRepository.create({
      description: '초과근무',
      startTime,
      endTime,
      user,
    });

    this.recordRepository.save(temp);
  }

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
    if (body.endTime) isExist.endTime = body.endTime;
    if (body.startTime) isExist.startTime = body.startTime;
    if (body.description) isExist.description = body.description;
    return this.recordRepository.save(isExist);
  }

  async findMyRecords(
    userId: number,
    {
      page,
      perPage,
      sortValue,
      sortKey,
      endDate,
      startDate,
      searchTerm,
    }: GetMyRecordsDto,
  ) {
    const iniQuery = this.recordRepository
      .createQueryBuilder('r')
      .select('r.id', 'id')
      .select([
        'r.id',
        'r.startTime',
        'r.endTime',
        'r.date',
        'r.duration',
        'r.status',
        'r.start',
        'r.end',
      ])
      .innerJoin('r.user', 'u')
      .where('u.id=:id', { id: userId })
      .take(perPage)
      .skip((page - 1) * perPage);

    const afterTermQuery = searchTerm
      ? iniQuery.where('r.description like :description', {
          description: `%${searchTerm}%`,
        })
      : iniQuery;

    const afterStartDate = startDate
      ? afterTermQuery.andWhere('DATE_FORMAT(r.startTime,"%Y-%m-%d")>=:start', {
          start: startDate,
        })
      : afterTermQuery;

    const afterEndDate = endDate
      ? afterStartDate.andWhere('DATE_FORMAT(r.startTime,"%Y-%m-%d")<=:end', {
          end: endDate,
        })
      : afterStartDate;

    if (!sortKey && !sortValue) {
      const defautSort = afterEndDate.orderBy('r.startTime', 'DESC');
      const [data, totalCount] = await defautSort.getManyAndCount();

      return {
        data,
        totalCount,
        totalPage: Math.ceil(totalCount / perPage),
      };
    }

    const aftrtStartTimeSort =
      sortKey === 'startTime'
        ? afterEndDate.orderBy('r.start', sortValue)
        : afterEndDate;

    const afterEndTimeSort =
      sortKey === 'endTime'
        ? aftrtStartTimeSort.orderBy('r.end', sortValue)
        : aftrtStartTimeSort;

    const afterSort =
      sortKey !== 'endTime' && sortKey !== 'startTime'
        ? afterEndTimeSort.addOrderBy('r.' + sortKey, sortValue)
        : afterEndTimeSort;

    const [data, totalCount] = await afterSort.getManyAndCount();

    return {
      data,
      totalCount,
      totalPage: Math.ceil(totalCount / perPage),
    };
  }

  async findAllRecords({
    page,
    perPage,
    sortValue,
    sortKey,
    endDate,
    searchTerm,
    startDate,
  }: GetMyRecordsDto) {
    const initQuery = this.recordRepository
      .createQueryBuilder('r')
      .select([
        'r.id',
        'r.date',
        'r.startTime',
        'r.endTime',
        'r.description',
        'r.duration',
        'r.status',
        'r.start',
        'r.end',
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
      ])
      .innerJoin('r.user', 'u')
      .take(perPage)
      .skip((page - 1) * perPage);

    const afterTermQuery = searchTerm
      ? initQuery.where('u.name like :description', {
          description: `%${searchTerm}%`,
        })
      : initQuery;

    const afterStartDate = startDate
      ? afterTermQuery.andWhere('DATE_FORMAT(r.startTime,"%Y-%m-%d")>=:start', {
          start: startDate,
        })
      : afterTermQuery;

    const afterEndDate = endDate
      ? afterStartDate.andWhere('DATE_FORMAT(r.startTime,"%Y-%m-%d")<=:end', {
          end: endDate,
        })
      : afterStartDate;

    if (!sortKey && !sortValue) {
      const defautSort = afterEndDate.orderBy('r.startTime', 'DESC');
      const [data, totalCount] = await defautSort.getManyAndCount();

      return {
        data,
        totalCount,
        totalPage: Math.ceil(totalCount / perPage),
      };
    }
    const aftrtStartTimeSort =
      sortKey === 'startTime'
        ? afterEndDate.orderBy('r.start', sortValue)
        : afterEndDate;

    const afterEndTimeSort =
      sortKey === 'endTime'
        ? aftrtStartTimeSort.orderBy('r.end', sortValue)
        : aftrtStartTimeSort;

    const afterSort =
      sortKey !== 'endTime' && sortKey !== 'startTime'
        ? afterEndTimeSort.addOrderBy(
            `${sortKey == 'userName' ? 'u.name' : 'r.' + sortKey}`,
            sortValue,
          )
        : afterEndTimeSort;

    const [data, totalCount] = await afterSort.getManyAndCount();

    return {
      data,
      totalCount,
      totalPage: Math.ceil(totalCount / perPage),
    };
  }

  async removeRecord({ id }: { id: number }) {
    const isExist = await this.recordRepository.count({ id });
    if (!isExist) throw new NotFoundException('없는 기록 입니다.');
    this.recordRepository.delete({ id });
  }

  async removeRecords(ids: string) {
    const count = await this.recordRepository
      .createQueryBuilder('r')
      .select('r.id')
      .where('r.id IN(:...ids)', { ids: ids.split(',') })
      .getCount();

    if (count !== ids.split(',').length)
      throw new NotFoundException('없는 기록 이 존재합니다.');

    await this.recordRepository
      .createQueryBuilder()
      .delete()
      .from(Record)
      .where('id IN (:...ids)', { ids: ids.split(',').map((id) => +id) })
      .execute();
  }
}
