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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../../common/entities/common.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
var Status;
(function (Status) {
    Status["working"] = "working";
    Status["done"] = "done";
    Status["notning"] = "nothing";
})(Status || (Status = {}));
let Record = class Record extends common_entity_1.Common {
    setDate() {
        const temp = this.startTime;
        const year = temp.getFullYear();
        const month = temp.getMonth();
        const date = temp.getDate();
        const m = month < 10 ? `0${month}` : month;
        const d = date < 10 ? `0${date}` : date;
        this.date = `${year}-${m}-${d}`;
    }
    setStart() {
        const hours = this.startTime.getHours();
        const minute = this.startTime.getMinutes();
        const h = hours < 10 ? `0${hours}` : hours + '';
        const m = minute < 10 ? `0${minute}` : minute + '';
        this.start = `${h}:${m}`;
    }
    setEnd() {
        if (!this.endTime)
            return;
        const hours = this.endTime.getHours();
        const minute = this.endTime.getMinutes();
        const h = hours < 10 ? `0${hours}` : hours + '';
        const m = minute < 10 ? `0${minute}` : minute + '';
        this.end = `${h}:${m}`;
    }
    setDuration() {
        if (this.endTime == null)
            this.duration = null;
        else
            this.duration = this.endTime.getTime() - this.startTime.getTime();
    }
    setStatus() {
        if (this.endTime)
            this.status = 'done';
        else
            this.status = 'working';
    }
};
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsDate)({ message: '시작시간은 날짜를 입력하세요' }),
    __metadata("design:type", Date)
], Record.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: '종료시간은 날짜를 입력하세요' }),
    __metadata("design:type", Date)
], Record.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: '초과근무' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Record.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.recordList, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId', referencedColumnName: 'id' }),
    __metadata("design:type", user_entity_1.User)
], Record.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 'nothing' }),
    (0, class_validator_1.IsEnum)(Status),
    __metadata("design:type", String)
], Record.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", Number)
], Record.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", String)
], Record.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", String)
], Record.prototype, "start", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", String)
], Record.prototype, "end", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Record.prototype, "setDate", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Record.prototype, "setStart", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Record.prototype, "setEnd", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Record.prototype, "setDuration", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Record.prototype, "setStatus", null);
Record = __decorate([
    (0, typeorm_1.Entity)()
], Record);
exports.Record = Record;
//# sourceMappingURL=record.entity.js.map