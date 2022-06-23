"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGateway = void 0;
const record_entity_1 = require("../record/entities/record.entity");
const manageUserList_1 = require("./manageUserList");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const login_dto_1 = require("./dtos/login.dto");
let EventGateway = class EventGateway {
    constructor(userRepository, manageUserList) {
        this.userRepository = userRepository;
        this.manageUserList = manageUserList;
    }
    async handleReconnect(socket, { id, role }) {
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
    addUserToList({ role, id, socketId, }) {
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
    handleNotice(socket, msg) {
        if (socket.handshake.auth.role !== 'Manager')
            return;
        if (!msg.trim())
            socket.emit('error', '공지사항을 입력하세요');
        socket.broadcast.to('login').emit('notice', msg);
    }
    async handleLogin(socket, msg) {
        const { id, role } = msg;
        if (!id || !role) {
            return socket.emit('error', '소켓 서버 접속을 실패했습니다. id, role');
        }
        socket.handshake.auth.id = id;
        socket.handshake.auth.role = role;
        socket.join('login');
        if (role === 'Manager')
            socket.join('manager');
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return socket.emit('error', '소켓 서버 접속을 실패했습니다 user');
        }
        socket.broadcast
            .to('manager')
            .emit('login', `${user.name} ${user.role}님이 로그인 했습니다.`);
        this.addUserToList({ id, socketId: socket.id, role });
    }
    handleDisconnect(socket) {
        const isManager = socket.handshake.auth.role === 'Manager';
        const id = socket.handshake.auth.id;
        socket.leave('login');
        if (isManager) {
            socket.leave('manager');
            this.manageUserList.deleteUser('manager', id);
        }
        this.manageUserList.deleteUser('login', id);
    }
    handleConnection(socket, data) {
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
            .addSelect(`JSON_ARRAYAGG(
          JSON_OBJECT(
            'id',record.id,
            'startTime',record.startTime,
            'endTime',record.endTime,
            'duration',record.duration
          )
      ) recordList`)
            .innerJoin((qb) => qb
            .select()
            .from(record_entity_1.Record, 'r')
            .where('DATE_FORMAT(r.startTime,"%Y-%m-%d")=DATE_FORMAT(NOW(),"%Y-%m-%d")')
            .andWhere('r.endTime IS NOT NULL'), 'record', 'record.userId = u.id')
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
            .addSelect(`JSON_ARRAYAGG(
          JSON_OBJECT(
            'id',record.id,
            'startTime',record.startTime,
            'endTime',record.endTime,
            'duration',record.duration
          )
      ) recordList`)
            .innerJoin((qb) => qb
            .select()
            .from(record_entity_1.Record, 'r')
            .where('DATE_FORMAT(r.startTime,"%Y-%m-%d")=DATE_FORMAT(NOW(),"%Y-%m-%d")')
            .andWhere('r.endTime IS NULL'), 'record', 'record.userId = u.id')
            .groupBy('u.id')
            .orderBy('u.name', 'ASC')
            .getRawMany();
        return workingUsers;
    }
    async startWork(id) {
        const user = this.manageUserList.getUser('login', id);
        if (!user)
            return;
        const userObj = await this.userRepository.findOne({ id }, { select: ['name'] });
        if (!userObj)
            return;
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
    async endWork(id) {
        const user = this.manageUserList.getUser('working', id);
        if (!user)
            return;
        const socketId = user.socketId;
        const userInfo = await this.userRepository.findOne({ id });
        if (!userInfo)
            return;
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
    async handleLogout(socket) {
        const auth = socket.handshake.auth;
        if (!auth || (auth && !Object.keys(auth)))
            return;
        socket.leave('login');
        this.manageUserList.deleteUser('login', auth.id);
        if (auth.role === 'Manager') {
            socket.leave('manager');
            this.manageUserList.deleteUser('manager', auth.id);
        }
    }
    async handleEditRecord(socket, { id, date }) {
        const editedUser = await this.userRepository.findOne({ id });
        if (!editedUser)
            socket.emit('error', '없는 유저입니다.');
        const editedUserInfo = this.manageUserList.getUser('login', id);
        if (editedUserInfo) {
            this.server
                .in(editedUserInfo.socketId)
                .emit('notice', `${date} 근무 기록이 수정되었습니다. 새로고침 한번 해주세요.`);
        }
        const workingUserList = await this.getWorkingUserList();
        const doneUserList = await this.getDoneUserList();
        this.server
            .in('manager')
            .emit('workingUsers', { workingUserList, doneUserList });
    }
    async handleDeleteRecord(socket, { id, date }) {
        const editedUser = await this.userRepository.findOne({ id });
        if (!editedUser)
            socket.emit('error', '없는 유저입니다.');
        const editedUserInfo = this.manageUserList.getUser('login', id);
        if (editedUserInfo) {
            this.server
                .in(editedUserInfo.socketId)
                .emit('notice', `${date} 근무 기록이 수정되었습니다. 새로고침 한번 해주세요.`);
        }
        const workingUserList = await this.getWorkingUserList();
        const doneUserList = await this.getDoneUserList();
        this.server
            .in('manager')
            .emit('workingUsers', { workingUserList, doneUserList });
    }
    async handleDeleteRecords(socket) {
        socket.broadcast.emit('notice', '다량의 기록을 삭제하였습니다 새로고침 한번 해주세요');
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('reConnect'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        login_dto_1.SocketLoginDto]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleReconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('notice'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], EventGateway.prototype, "handleNotice", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('login'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        login_dto_1.SocketLoginDto]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleLogin", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventGateway.prototype, "handleDisconnect", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], EventGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('logout'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleLogout", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('editRecord'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleEditRecord", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteRecord'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleDeleteRecord", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteRecords'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], EventGateway.prototype, "handleDeleteRecords", null);
EventGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    }),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        manageUserList_1.ManageUserList])
], EventGateway);
exports.EventGateway = EventGateway;
//# sourceMappingURL=event.gateway.js.map