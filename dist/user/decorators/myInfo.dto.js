"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyInfoDto = void 0;
const record_entity_1 = require("../../record/entities/record.entity");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../entities/user.entity");
class MyInfoRecordDto extends (0, swagger_1.PickType)(record_entity_1.Record, [
    'id',
    'startTime',
    'endTime',
    'description',
]) {
}
class MyInfoDto extends (0, swagger_1.PickType)(user_entity_1.User, ['id', 'role']) {
}
exports.MyInfoDto = MyInfoDto;
//# sourceMappingURL=myInfo.dto.js.map