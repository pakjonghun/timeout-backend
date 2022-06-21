"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../user/entities/user.entity");
class SocketLoginDto extends (0, swagger_1.PickType)(user_entity_1.User, ['id', 'role']) {
}
exports.SocketLoginDto = SocketLoginDto;
//# sourceMappingURL=login.dto.js.map