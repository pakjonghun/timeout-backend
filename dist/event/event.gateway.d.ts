import { ManageUserList } from './manageUserList';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SocketLoginDto } from './dtos/login.dto';
export declare class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly userRepository;
    private readonly manageUserList;
    constructor(userRepository: Repository<User>, manageUserList: ManageUserList);
    server: Server;
    handleReconnect(socket: Socket, { id, role }: SocketLoginDto): Promise<boolean>;
    private addUserToList;
    handleNotice(socket: Socket, msg: string): void;
    handleLogin(socket: Socket, msg: SocketLoginDto): Promise<boolean>;
    handleDisconnect(socket: Socket): void;
    handleConnection(socket: Socket, data: string): void;
    getLoginManagerIdList(): Promise<Set<string>>;
    getDoneUserList(): Promise<any[]>;
    getWorkingUserList(): Promise<any[]>;
    startWork(id: number): Promise<void>;
    endWork(id: number): Promise<void>;
    handleLogout(socket: Socket): Promise<void>;
    handleEditRecord(socket: Socket, { id, date }: {
        id: number;
        date: string;
    }): Promise<void>;
    handleDeleteRecord(socket: Socket, { id, date }: {
        id: number;
        date: string;
    }): Promise<void>;
    handleDeleteRecords(socket: Socket): Promise<void>;
}
