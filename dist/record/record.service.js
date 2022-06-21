"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordService = void 0;
const record_entity_1 = require("../record/entities/record.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let RecordService = class RecordService {
    constructor(recordRepository) {
        this.recordRepository = recordRepository;
    }
    async create({ user, endTime, startTime, }) {
        const temp = this.recordRepository.create({
            description: '초과근무',
            startTime,
            endTime,
            user,
        });
        this.recordRepository.save(temp);
    }
    async startRecord(userId, startRecordDto) {
        const tempObj = this.recordRepository.create(Object.assign({ user: { id: userId } }, startRecordDto));
        return this.recordRepository.save(tempObj);
    }
    async findRecordById(id) {
        return this.recordRepository
            .createQueryBuilder('r')
            .select('r.id')
            .addSelect(['r.startTime', 'r.endTime', 'r.description'])
            .where('r.id= :id', { id })
            .getOne();
    }
    async updateRecord(id, body) {
        const isExist = await this.recordRepository.findOne({ id });
        if (!isExist)
            throw new common_1.NotFoundException('없는 기록 입니다.');
        if (body.endTime)
            isExist.endTime = body.endTime;
        if (body.startTime)
            isExist.startTime = body.startTime;
        if (body.description)
            isExist.description = body.description;
        return this.recordRepository.save(isExist);
    }
    async findMyRecords(userId, { page, perPage, sortValue, sortKey, endDate, startDate, searchTerm, }) {
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
            'r.createdAt',
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
            const defautSort = afterEndDate.orderBy('r.createdAt', 'DESC');
            const [data, totalCount] = await defautSort.getManyAndCount();
            return {
                data,
                totalCount,
                totalPage: Math.ceil(totalCount / perPage),
            };
        }
        const aftrtStartTimeSort = sortKey === 'startTime'
            ? afterEndDate.orderBy('r.start', sortValue)
            : afterEndDate;
        const afterEndTimeSort = sortKey === 'endTime'
            ? aftrtStartTimeSort.orderBy('r.end', sortValue)
            : aftrtStartTimeSort;
        const afterSort = sortKey !== 'endTime' && sortKey !== 'startTime'
            ? afterEndTimeSort.addOrderBy('r.' + sortKey, sortValue)
            : afterEndTimeSort;
        const [data, totalCount] = await afterSort.getManyAndCount();
        return {
            data,
            totalCount,
            totalPage: Math.ceil(totalCount / perPage),
        };
    }
    async findAllRecords({ page, perPage, sortValue, sortKey, endDate, searchTerm, startDate, }) {
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
            'r.createdAt',
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
            const defautSort = afterEndDate.orderBy('r.createdAt', 'DESC');
            const [data, totalCount] = await defautSort.getManyAndCount();
            return {
                data,
                totalCount,
                totalPage: Math.ceil(totalCount / perPage),
            };
        }
        const aftrtStartTimeSort = sortKey === 'startTime'
            ? afterEndDate.orderBy('r.start', sortValue)
            : afterEndDate;
        const afterEndTimeSort = sortKey === 'endTime'
            ? aftrtStartTimeSort.orderBy('r.end', sortValue)
            : aftrtStartTimeSort;
        const afterSort = sortKey !== 'endTime' && sortKey !== 'startTime'
            ? afterEndTimeSort.addOrderBy(`${sortKey == 'userName' ? 'u.name' : 'r.' + sortKey}`, sortValue)
            : afterEndTimeSort;
        const [data, totalCount] = await afterSort.getManyAndCount();
        return {
            data,
            totalCount,
            totalPage: Math.ceil(totalCount / perPage),
        };
    }
    async removeRecord({ id }) {
        const isExist = await this.recordRepository.count({ id });
        if (!isExist)
            throw new common_1.NotFoundException('없는 기록 입니다.');
        this.recordRepository.delete({ id });
    }
    async removeRecords(ids) {
        const count = await this.recordRepository
            .createQueryBuilder('r')
            .select('r.id')
            .where('r.id IN(:...ids)', { ids: ids.split(',') })
            .getCount();
        if (count !== ids.split(',').length)
            throw new common_1.NotFoundException('없는 기록 이 존재합니다.');
        await this.recordRepository
            .createQueryBuilder()
            .delete()
            .from(record_entity_1.Record)
            .where('id IN (:...ids)', { ids: ids.split(',').map((id) => +id) })
            .execute();
    }
};
RecordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(record_entity_1.Record)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RecordService);
exports.RecordService = RecordService;
//# sourceMappingURL=record.service.js.map