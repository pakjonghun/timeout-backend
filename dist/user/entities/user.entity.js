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
exports.User = exports.Role = void 0;
const bcryptjs_1 = require("bcryptjs");
const class_validator_1 = require("class-validator");
const common_entity_1 = require("../../common/entities/common.entity");
const record_entity_1 = require("../../record/entities/record.entity");
const typeorm_1 = require("typeorm");
var Role;
(function (Role) {
    Role["Manager"] = "Manager";
    Role["Client"] = "Client";
})(Role = exports.Role || (exports.Role = {}));
let User = class User extends common_entity_1.Common {
    async hashPassword() {
        if (!this.password)
            return;
        this.password = await (0, bcryptjs_1.hash)(this.password, 10);
    }
    async comparePassword(password) {
        return (0, bcryptjs_1.compare)(password, this.password);
    }
};
__decorate([
    (0, typeorm_1.Column)({ default: 'Client' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Role),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 10, { message: '비밀번호는 2~10글자 입니다.' }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.Length)(2, 10, { message: '이름은 2~10글자 길이의 문자열 입니다.' }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsEmail)({}, { message: '이메일 형식을 지켜야 합니다.' }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, type: 'bigint' }),
    (0, class_validator_1.Matches)(/^[0-9]{11}$/, { message: '휴대폰 번호는 11자리 입니다.' }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], User.prototype, "avatar2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => record_entity_1.Record, (record) => record.user),
    __metadata("design:type", Array)
], User.prototype, "recordList", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map