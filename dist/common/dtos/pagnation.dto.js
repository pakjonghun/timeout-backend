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
exports.PagnationDto = void 0;
const class_validator_1 = require("class-validator");
class PagnationDto {
}
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: '페이지 숫자를 입력하세요' }),
    (0, class_validator_1.Min)(1, { message: '페이지는 최소 1이상의 숫자를 입력하세요' }),
    __metadata("design:type", Number)
], PagnationDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: '페이지별 출력할 데이터의 숫자를 입력하세요' }),
    (0, class_validator_1.Min)(1, { message: '페이지별 출력할 데이터의 숫자는 최소 1이상 입니다.' }),
    __metadata("design:type", Number)
], PagnationDto.prototype, "perPage", void 0);
exports.PagnationDto = PagnationDto;
//# sourceMappingURL=pagnation.dto.js.map