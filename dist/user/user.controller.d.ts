/// <reference types="multer" />
import { User } from '../user/entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { Response } from 'express';
import { User as UserEntity } from './entities/user.entity';
import { PagnationDto } from '../common/dtos/pagnation.dto';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordDto, UpdateUserPasswordDto } from './dtos/updatePassword.dto';
import { Repository } from 'typeorm';
export declare class UserController {
    private readonly userService;
    private readonly configService;
    private readonly userRepository;
    constructor(userService: UserService, configService: ConfigService, userRepository: Repository<UserEntity>);
    getPrivateInfo(user: User): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    logout(res: Response): Promise<void>;
    login(res: Response, loginUserDto: LoginUserDto): Promise<{
        id: number;
        role: "Manager" | "Client";
    }>;
    me(user: User): Promise<User>;
    updateMyProfile(user: User, updateUserDto: UpdateUserDto): Promise<{
        role?: "Manager" | "Client";
        avatar?: string;
        email?: string;
        phone?: string;
        name?: string;
        id: number;
    } & User>;
    updateMyPassword(user: User, updatePasswordDto: UpdatePasswordDto): Promise<User>;
    updateUserPassword(id: number, updateUserPasswordDto: UpdateUserPasswordDto): Promise<{
        id: number;
        password: string;
    } & User>;
    updateUserProfile(id: number, updateUserDto: UpdateUserDto): Promise<{
        role?: "Manager" | "Client";
        avatar?: string;
        email?: string;
        phone?: string;
        name?: string;
        id: number;
    } & User>;
    findUser(id: number): Promise<User>;
    findAllUsers(query: PagnationDto): Promise<{
        users: User[];
        totalCount: number;
        totalPage: number;
        message: string;
    }>;
    remove(id: string): Promise<void>;
    uploadAvatar(file: Express.Multer.File, user: User): Promise<{
        original: string;
        resized: string;
    }>;
}
