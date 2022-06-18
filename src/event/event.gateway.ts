import { Record } from 'src/record/entities/record.entity';
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

  @SubscribeMessage('reConnect')
  async handleReconnect(
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
    this.addUserToList({ role, socketId: socket.id, id });
    if (role === 'Manager') {
      socket.join('manager');
      const workingUserList = await this.getWorkingUserList();
      socket.emit('workingUsers', workingUserList);
    }
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
    if (socket.handshake.auth.role !== 'Manager') return;
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
    if (role === 'Manager') {
      socket.join('manager');
      // const workingUserList = await this.getWorkingUserList();
      // socket.emit('workingUsers', workingUserList);
    }

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
    console.log('connect');
  }

  async getLoginManagerIdList() {
    return this.server.in('manager').allSockets();
  }

  async getWorkingUserList() {
    const workingUsers = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.phone', 'user.email'])
      .innerJoinAndSelect(
        (bq) =>
          bq
            .select('r.endTime,r.userId,r.startTime')
            .from(Record, 'r')
            .where('r.endTime IS NULL'),
        'record',
        'record.userId=user.id',
      )
      .orderBy('record.startTime', 'DESC')
      .getMany();

    return workingUsers;
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

    const workingUserList = await this.getWorkingUserList();

    this.server.in('manager').emit('workingUsers', workingUserList);
    this.server
      .in('manager')
      .emit(
        'notice',
        `${workingUserList[0].name}님이 초과근무를 시작했습니다.`,
      );
  }

  async endWork(id: number) {
    const user = this.manageUserList.getUser('working', id);
    if (!user) return;

    const userInfo = await this.userRepository.findOne({ id });
    if (!userInfo) return;

    this.server
      .in('manager')
      .emit('notice', `${userInfo.name}님이 초과근무를 종료하였습니다.`);
    this.server.in(user.socketId).socketsLeave('work');
    this.server.in(user.socketId).socketsJoin('done');
    this.manageUserList.deleteUser('working', id);
    this.manageUserList.addUser({
      room: 'done',
      userId: id,
      socketId: user.socketId,
    });

    const workingUserList = await this.getWorkingUserList();
    this.server.in('manager').emit('workingUsers', workingUserList);
  }
}
