import { User } from './../entities/user.entity';
declare const LoginUserDto_base: import("@nestjs/common").Type<Pick<User, "password" | "email">>;
export declare class LoginUserDto extends LoginUserDto_base {
}
export {};
