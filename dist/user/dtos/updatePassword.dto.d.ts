import { CreateUserDto } from './createUser.dto';
declare const UpdatePasswordDto_base: import("@nestjs/common").Type<Pick<CreateUserDto, "password" | "passwordConfirm">>;
export declare class UpdatePasswordDto extends UpdatePasswordDto_base {
}
declare const UpdateUserPasswordDto_base: import("@nestjs/common").Type<Pick<CreateUserDto, "password">>;
export declare class UpdateUserPasswordDto extends UpdateUserPasswordDto_base {
}
export {};
