"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = void 0;
const user_entity_1 = require("./../entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
class LoginUserDto extends (0, swagger_1.PickType)(user_entity_1.User, ['email', 'password']) {
}
exports.LoginUserDto = LoginUserDto;
//# sourceMappingURL=loginUser.dto.js.map