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
exports.GetMyRecordsDto = void 0;
const class_validator_1 = require("class-validator");
const pagnation_dto_1 = require("../../common/dtos/pagnation.dto");
class GetMyRecordsDto extends pagnation_dto_1.PagnationDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/[(ASC)(DESC)]/, { message: '정렬 값은 ASC 나 DESC 입니다.' }),
    __metadata("design:type", String)
], GetMyRecordsDto.prototype, "sortValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '정렬 키는 문자열 입니다.' }),
    __metadata("design:type", String)
], GetMyRecordsDto.prototype, "sortKey", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '검색어는 문자열 입니다.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetMyRecordsDto.prototype, "searchTerm", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '검색날짜는 문자열 입니다.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetMyRecordsDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: '검색날짜는 문자열 입니다.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetMyRecordsDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: '리패치 데이터는 숫자 입니다.' }),
    __metadata("design:type", Number)
], GetMyRecordsDto.prototype, "refetch", void 0);
exports.GetMyRecordsDto = GetMyRecordsDto;
//# sourceMappingURL=getMyRecord.dto.js.map