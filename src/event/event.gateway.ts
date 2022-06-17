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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  private socketList = new Map();

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { id, message }: { id: number; message: string },
  ) {
    const socketId = this.socketList.get(id);
    this.server.in(socketId).emit('message', message);
  }

  @SubscribeMessage('requestChat')
  handleEndChat(@MessageBody() id: number) {
    const socketId = this.socketList.get(id);

    //룸 숫자는 룸1 룸2 룸3 이런식
    //룸 해당 소켓아이디가 룸에 있으면
    //상담중입니다 라고 emit
    //아니면 상담 시작 하면서 룸에 들어감
    //상담끝나면 룸은 폭파
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const key = socket.handshake.query.key;
    const id = this.socketList.get(key);
    this.socketList.delete(key);
    this.socketList.delete(id);
    socket.leave('login');
    socket.leave('manager');
  }

  handleConnection(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: string,
  ) {
    // const key = socket.handshake.query;
    // this.socketList.set(key, socket.id);
    // const memberCount = socket.nsp.adapter.sids.size;
    // socket.nsp.emit('hi', memberCount);
    console.log('connected');

    console.log(socket.handshake.auth);

    socket.emit('hi', 'welcome');
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
