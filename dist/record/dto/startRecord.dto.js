"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const record_entity_1 = require("../entities/record.entity");
class StartRecordDto extends (0, swagger_1.PickType)(record_entity_1.Record, [
    'startTime',
    'description',
]) {
}
exports.StartRecordDto = StartRecordDto;
//# sourceMappingURL=startRecord.dto.js.map