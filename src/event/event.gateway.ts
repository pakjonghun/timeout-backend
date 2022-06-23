import { Record } from '../record/entities/record.entity';
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
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { SocketLoginDto } from './dtos/login.dto';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: [
      process.env.URL,
      `${process.env.URL}:80`,
      `${process.env.URL}:8080`,
      'http://fireking5997.xyz',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
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
      const doneUserList = await this.getDoneUserList();
      socket.emit('workingUsers', { workingUserList, doneUserList });
    }

    this.manageUserList.updateUserListWithLogin(id);
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
      return socket.emit('error', '소켓 서버 접속을 실패했습니다. id, role');
    }
    socket.handshake.auth.id = id;
    socket.handshake.auth.role = role;
    socket.join('login');
    if (role === 'Manager') socket.join('manager');

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
    return;
  }

  async getLoginManagerIdList() {
    return this.server.in('manager').allSockets();
  }

  async getDoneUserList() {
    const doneUsers = await this.userRepository
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.phone', 'phone')
      .addSelect('u.email', 'email')
      .addSelect('u.role', 'role')
      .addSelect('SUM(record.duration)', 'sumDuration')
      .addSelect('COUNT(record.id)listCount')
      .addSelect(
        `JSON_ARRAYAGG(
          JSON_OBJECT(
            'id',record.id,
            'startTime',record.startTime,
            'endTime',record.endTime,
            'duration',record.duration
          )
      ) recordList`,
      )
      .innerJoin(
        (qb) =>
          qb
            .select()
            .from(Record, 'r')
            .where(
              'DATE_FORMAT(r.startTime,"%Y-%m-%d")=DATE_FORMAT(NOW(),"%Y-%m-%d")',
            )
            .andWhere('r.endTime IS NOT NULL'),
        'record',
        'record.userId = u.id',
      )
      .groupBy('u.id')
      .orderBy('u.name', 'ASC')
      .getRawMany();
    return doneUsers;
  }

  async getWorkingUserList() {
    const workingUsers = await this.userRepository
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.phone', 'phone')
      .addSelect('u.email', 'email')
      .addSelect('u.role', 'role')
      .addSelect('COUNT(record.id)listCount')
      .addSelect(
        `JSON_ARRAYAGG(
          JSON_OBJECT(
            'id',record.id,
            'startTime',record.startTime,
            'endTime',record.endTime,
            'duration',record.duration
          )
      ) recordList`,
      )
      .innerJoin(
        (qb) =>
          qb
            .select()
            .from(Record, 'r')
            .where(
              'DATE_FORMAT(r.startTime,"%Y-%m-%d")=DATE_FORMAT(NOW(),"%Y-%m-%d")',
            )
            .andWhere('r.endTime IS NULL'),
        'record',
        'record.userId = u.id',
      )
      .groupBy('u.id')
      .orderBy('u.name', 'ASC')
      .getRawMany();
    return workingUsers;
  }

  async startWork(id: number) {
    const user = this.manageUserList.getUser('login', id);
    if (!user) return;

    const userObj = await this.userRepository.findOne(
      { id },
      { select: ['name'] },
    );
    if (!userObj) return;

    this.manageUserList.addUser({
      room: 'working',
      userId: id,
      socketId: user.socketId,
    });
    this.server.in(user.socketId).socketsJoin('working');

    const workingUserList = await this.getWorkingUserList();
    const doneUserList = await this.getDoneUserList();

    this.server
      .in('manager')
      .emit('workingUsers', { workingUserList, doneUserList });

    this.server
      .in('manager')
      .emit('notice', `${userObj.name}님이 초과근무를 시작했습니다.`);
  }

  async endWork(id: number) {
    const user = this.manageUserList.getUser('working', id);
    if (!user) return;

    const socketId = user.socketId;

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
      socketId,
    });

    const workingUserList = await this.getWorkingUserList();
    const doneUserList = await this.getDoneUserList();

    this.server
      .in('manager')
      .emit('workingUsers', { workingUserList, doneUserList });
  }

  @SubscribeMessage('logout')
  async handleLogout(@ConnectedSocket() socket: Socket) {
    const auth = socket.handshake.auth;
    if (!auth || (auth && !Object.keys(auth))) return;

    socket.leave('login');
    this.manageUserList.deleteUser('login', auth.id);
    if (auth.role === 'Manager') {
      socket.leave('manager');
      this.manageUserList.deleteUser('manager', auth.id);
    }
  }

  @SubscribeMessage('editRecord')
  async handleEditRecord(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { id, date }: { id: number; date: string },
  ) {
    const editedUser = await this.userRepository.findOne({ id });
    if (!editedUser) socket.emit('error', '없는 유저입니다.');
    const editedUserInfo = this.manageUserList.getUser('login', id);
    if (editedUserInfo) {
      this.server
        .in(editedUserInfo.socketId)
        .emit(
          'notice',
          `${date} 근무 기록이 수정되었습니다. 새로고침 한번 해주세요.`,
        );
    }

    const workingUserList = await this.getWorkingUserList();
    const doneUserList = await this.getDoneUserList();
    this.server
      .in('manager')
      .emit('workingUsers', { workingUserList, doneUserList });
  }

  @SubscribeMessage('deleteRecord')
  async handleDeleteRecord(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { id, date }: { id: number; date: string },
  ) {
    const editedUser = await this.userRepository.findOne({ id });
    if (!editedUser) socket.emit('error', '없는 유저입니다.');

    const editedUserInfo = this.manageUserList.getUser('login', id);
    if (editedUserInfo) {
      this.server
        .in(editedUserInfo.socketId)
        .emit(
          'notice',
          `${date} 근무 기록이 수정되었습니다. 새로고침 한번 해주세요.`,
        );
    }

    const workingUserList = await this.getWorkingUserList();
    const doneUserList = await this.getDoneUserList();
    this.server
      .in('manager')
      .emit('workingUsers', { workingUserList, doneUserList });
  }

  @SubscribeMessage('deleteRecords')
  async handleDeleteRecords(@ConnectedSocket() socket: Socket) {
    socket.broadcast.emit(
      'notice',
      '다량의 기록을 삭제하였습니다 새로고침 한번 해주세요',
    );
  }
}
