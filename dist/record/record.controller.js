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
exports.RecordController = void 0;
const updateRecords_dto_1 = require("./dto/updateRecords.dto");
const getMyRecord_dto_1 = require("./dto/getMyRecord.dto");
const endRecord_dto_1 = require("./dto/endRecord.dto");
const role_decorator_1 = require("./../user/decorators/role.decorator");
const common_1 = require("@nestjs/common");
const record_service_1 = require("./record.service");
const startRecord_dto_1 = require("./dto/startRecord.dto");
const user_decorator_1 = require("../user/decorators/user.decorator");
const myInfo_dto_1 = require("../user/decorators/myInfo.dto");
const event_gateway_1 = require("../event/event.gateway");
let RecordController = class RecordController {
    constructor(recordService, eventGateway) {
        this.recordService = recordService;
        this.eventGateway = eventGateway;
    }
    async startRecord(startRecordDto, user) {
        const record = await this.recordService.startRecord(user.id, startRecordDto);
        this.eventGateway.startWork(user.id);
        return this.recordService.findRecordById(record.id);
    }
    async update(endRecordDto, user) {
        if (!user.recordList.id) {
            throw new common_1.NotFoundException('초과근무 기록이 없습니다.');
        }
        const endRecord = await this.recordService.updateRecord(user.recordList.id, endRecordDto);
        this.eventGateway.endWork(user.id);
        return this.recordService.findRecordById(endRecord.id);
    }
    async getMyRecords(getMyRecordsDto, user) {
        if (user.role === 'Client') {
            return this.recordService.findMyRecords(user.id, getMyRecordsDto);
        }
        return this.recordService.findAllRecords(getMyRecordsDto);
    }
    async updateRecords(id, updateRecordDto) {
        await this.recordService.updateRecord(id, updateRecordDto);
    }
    async removeMany(ids) {
        await this.recordService.removeRecords(ids);
    }
    async removeRecord(id) {
        return this.recordService.removeRecord({ id });
    }
    async getTodayList(getMyRecordsDto) {
        return this.recordService.findAllRecords(getMyRecordsDto);
    }
};
__decorate([
    (0, role_decorator_1.Role)('Any'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [startRecord_dto_1.StartRecordDto,
        myInfo_dto_1.MyInfoDto]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "startRecord", null);
__decorate([
    (0, role_decorator_1.Role)('Any'),
    (0, common_1.Patch)('end'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [endRecord_dto_1.EndRecordDto, myInfo_dto_1.MyInfoDto]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "update", null);
__decorate([
    (0, role_decorator_1.Role)('Any'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getMyRecord_dto_1.GetMyRecordsDto,
        myInfo_dto_1.MyInfoDto]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "getMyRecords", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Patch)('/admin/edit/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateRecords_dto_1.UpdateRecordDto]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "updateRecords", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Delete)('/admin/delete'),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "removeMany", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Delete)('/admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "removeRecord", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Delete)('/admin/today'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getMyRecord_dto_1.GetMyRecordsDto]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "getTodayList", null);
RecordController = __decorate([
    (0, common_1.Controller)('records'),
    __metadata("design:paramtypes", [record_service_1.RecordService,
        event_gateway_1.EventGateway])
], RecordController);
exports.RecordController = RecordController;
//# sourceMappingURL=record.controller.js.map