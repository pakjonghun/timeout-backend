import { RoleType } from './../entities/user.entity';
import { User } from '../entities/user.entity';
declare const CreateUserDto_base: import("@nestjs/common").Type<Pick<User, "password" | "name" | "email" | "phone">>;
export declare class CreateUserDto extends CreateUserDto_base {
    avatar: string;
    role: RoleType;
    passwordConfirm: string;
}
export {};
