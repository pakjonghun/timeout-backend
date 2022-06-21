import { CreateUserDto } from './createUser.dto';
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateUserDto, "password" | "passwordConfirm">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
