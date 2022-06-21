"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const createUser_dto_1 = require("./createUser.dto");
class UpdateUserDto extends (0, mapped_types_1.PartialType)((0, swagger_1.OmitType)(createUser_dto_1.CreateUserDto, ['passwordConfirm', 'password'])) {
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=updateUser.dto.js.map