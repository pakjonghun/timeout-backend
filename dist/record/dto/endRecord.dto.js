"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const record_entity_1 = require("../entities/record.entity");
class EndRecordDto extends (0, mapped_types_1.PartialType)((0, swagger_1.PickType)(record_entity_1.Record, ['endTime'])) {
}
exports.EndRecordDto = EndRecordDto;
//# sourceMappingURL=endRecord.dto.js.map