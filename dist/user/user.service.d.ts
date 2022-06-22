import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/loginUser.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { User } from './entities/user.entity';
import { PagnationDto } from '../common/dtos/pagnation.dto';
import { UpdatePasswordDto, UpdateUserPasswordDto } from './dtos/updatePassword.dto';
import { EventGateway } from '../event/event.gateway';
export declare class UserService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly eventGateway;
    constructor(userRepository: Repository<User>, jwtService: JwtService, eventGateway: EventGateway);
    create(createUserDto: CreateUserDto): Promise<User>;
    login(loginUserDto: LoginUserDto): Promise<{
        token: string;
        user: User;
    }>;
    getLoginManager(idList: any): Promise<User[]>;
    findUserInfoById(id: number): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    findUserById(id: number): Promise<User>;
    findAllUsers(query: PagnationDto): Promise<{
        users: User[];
        totalCount: number;
        totalPage: number;
        message: string;
    }>;
    removeUser(id: number): Promise<import("typeorm").DeleteResult>;
    updateUserProfile(id: number, updateUserDto: UpdateUserDto): Promise<{
        role?: "Client" | "Manager";
        name?: string;
        email?: string;
        phone?: string;
        avatar?: string;
        id: number;
    } & User>;
    updateMyPassword(id: number, { password }: UpdatePasswordDto): Promise<User>;
    updateUserPassword(id: number, { password }: UpdateUserPasswordDto): Promise<{
        id: number;
        password: string;
    } & User>;
    getPrivateInfo(id: number): Promise<User>;
}
