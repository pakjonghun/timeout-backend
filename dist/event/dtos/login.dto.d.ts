import { User } from '../../user/entities/user.entity';
declare const SocketLoginDto_base: import("@nestjs/common").Type<Pick<User, "id" | "role">>;
export declare class SocketLoginDto extends SocketLoginDto_base {
}
export {};
