import { Record } from 'src/record/entities/record.entity';
import { User } from 'src/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { StartRecordDto } from './dto/startRecord.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async startRecord(user: User, startRecordDto: StartRecordDto) {
    return this.recordRepository.save({ user, ...startRecordDto });
  }

  async findRecordById(id: number) {
    return this.recordRepository
      .createQueryBuilder('r')
      .select('r.id')
      .addSelect(['r.id', 'r.startTime', 'r.endTime', 'r.description'])
      .addSelect(['u.id', 'u.name'])
      .innerJoin('r.user', 'u')
      .getOne();
  }

  findAll() {
    return `This action returns all record`;
  }

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return `This action updates a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
