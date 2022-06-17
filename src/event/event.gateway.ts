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
    if (!id || !role)
      return socket.emit('error', '실시간 서버 접속을 실패했습니다');
    socket.handshake.auth.id = id;
    socket.handshake.auth.role = role;
    socket.join('login');
    if (role === 'Manager') socket.join('manager');
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

  @SubscribeMessage('login')
  async handleLogin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() msg: SocketLoginDto,
  ) {
    const { id, role } = msg;
    if (!id || !role)
      return socket.emit('error', '실시간 서버 접속을 실패했습니다');
    socket.handshake.auth.id = id;
    socket.handshake.auth.role = role;
    socket.join('login');
    if (role === 'Manager') socket.join('manager');

    console.log('login');

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return socket.emit('error', '실시간 서버 접속을 실패했습니다');
    socket.broadcast
      .to('login')
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

  login(key: string, id: number, isManager = false, managerList: any[]) {
    const socketId = this.socketList.get(key);
    this.socketList.set(key, id);
    this.socketList.set(id, socketId);
    this.server.in(socketId).socketsJoin('login');
    if (isManager) this.server.in(socketId).socketsJoin('manager');

    this.server.sockets.to('login').emit('managerList', managerList);
  }

  startWork(id: number) {
    const socketId = this.socketList.get(id);
    this.server.in(socketId).socketsJoin('work');
    this.server.sockets.to('work').emit('hi', 'rehi');
  }

  endWork(id: number) {
    const socketId = this.socketList.get(id);
    this.server.in(socketId).socketsLeave('work');
    this.server.in(socketId).socketsJoin('endWork');
    this.server.sockets.to('endWork').emit('hi', 'rehi');
  }
}
