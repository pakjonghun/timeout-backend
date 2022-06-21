"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPasswordDto = exports.UpdatePasswordDto = void 0;
const createUser_dto_1 = require("./createUser.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdatePasswordDto extends (0, swagger_1.PickType)(createUser_dto_1.CreateUserDto, [
    'password',
    'passwordConfirm',
]) {
}
exports.UpdatePasswordDto = UpdatePasswordDto;
class UpdateUserPasswordDto extends (0, swagger_1.PickType)(createUser_dto_1.CreateUserDto, [
    'password',
]) {
}
exports.UpdateUserPasswordDto = UpdateUserPasswordDto;
//# sourceMappingURL=updatePassword.dto.js.map