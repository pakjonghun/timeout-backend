import { Common } from '../../common/entities/common.entity';
import { Record } from '../../record/entities/record.entity';
export declare enum Role {
    'Manager' = "Manager",
    'Client' = "Client"
}
export declare type RoleType = keyof typeof Role;
export declare class User extends Common {
    role: RoleType;
    password: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    avatar2?: string;
    recordList: Record[];
    hashPassword(): Promise<void>;
    comparePassword(password: string): Promise<boolean>;
}
