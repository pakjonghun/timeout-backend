import { ManageUserList } from './manageUserList';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SocketLoginDto } from './dtos/login.dto';
import { retryWhen } from 'rxjs';
import { Record } from 'src/record/entities/record.entity';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly manageUserList: ManageUserList,
  ) {}

  @WebSocketServer() public server: Server;

  private socketList = new Map();

  @SubscribeMessage('reConnect')
  handleReconnect(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { id, role }: SocketLoginDto,
  ) {
    console.log('reconnect');
    if (!id || !role) {
      return socket.emit('error', '소켓 서버 접속을 실패했습니다 id role');
    }
    socket.handshake.auth.id = id;
    socket.handshake.auth.role = role;
    socket.join('login');
    if (role === 'Manager') socket.join('manager');
    this.addUserToList({ role, socketId: socket.id, id });
  }

  private addUserToList({
    role,
    id,
    socketId,
  }: {
    role: 'Manager' | 'Client';
    id: number;
    socketId: string;
  }) {
    if (role === 'Manager') {
      this.manageUserList.addUser({
        room: 'manager',
        userId: id,
        socketId: socketId,
      });
    }

    this.manageUserList.addUser({
      room: 'login',
      userId: id,
      socketId: socketId,
    });
  }

  @SubscribeMessage('notice')
  handleNotice(@ConnectedSocket() socket: Socket, @MessageBody() msg: string) {
    if (socket.handshake.auth.role !== 'Client') return;
    if (!msg.trim()) socket.emit('error', '공지사항을 입력하세요');
    socket.broadcast.to('login').emit('notice', msg);
  }

  @SubscribeMessage('login')
  async handleLogin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SocketLoginDto,
  ) {
    const { id, role } = msg;
    if (!id || !role) {
      console.log('login');
      return socket.emit('error', '소켓 서버 접속을 실패했습니다. id, role');
    }
    socket.handshake.auth.id = id;
    socket.handshake.auth.role = role;
    socket.join('login');
    if (role === 'Manager') socket.join('manager');

    console.log('login');

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return socket.emit('error', '소켓 서버 접속을 실패했습니다 user');
    }

    socket.broadcast
      .to('manager')
      .emit('login', `${user.name} ${user.role}님이 로그인 했습니다.`);

    this.addUserToList({ id, socketId: socket.id, role });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const isManager = socket.handshake.auth.role === 'Manager';
    const id = socket.handshake.auth.id;
    socket.leave('login');

    if (isManager) {
      socket.leave('manager');
      this.manageUserList.deleteUser('manager', id);
    }

    this.manageUserList.deleteUser('login', id);
  }

  handleConnection(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: string,
  ) {
    console.log('connected');
  }

  async getLoginManagerIdList() {
    return this.server.in('manager').allSockets();
  }

  async startWork(id: number) {
    const user = this.manageUserList.getUser('login', id);
    if (!user) return;
    this.manageUserList.addUser({
      room: 'working',
      userId: id,
      socketId: user.socketId,
    });
    this.server.in(user.socketId).socketsJoin('working');

    const workingUsers = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.phone', 'user.email'])
      .innerJoinAndSelect(
        'user.recordList',
        'record',
        "DATE_FORMAT(record.startTime,'%Y-%m-%d')=DATE_FORMAT(now(),'%Y-%m-%d')",
      )
      .getMany();

    if (!workingUsers.length) {
      this.server
        .in(user.socketId)
        .emit('notice', '초과근무중인 사람이 없습니다.');
      return;
    }
    // console.log('workingUsers', workingUsers.length);
    console.log(this.manageUserList.getUsers('manager'));
    this.server.in('manager').emit('workingUsers', workingUsers);
  }

  endWork(id: number) {
    const socketId = this.socketList.get(id);
    this.server.in(socketId).socketsLeave('work');
    this.server.in(socketId).socketsJoin('endWork');
    this.server.sockets.to('endWork').emit('hi', 'rehi');
  }
}
