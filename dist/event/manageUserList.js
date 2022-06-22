"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageUserList = void 0;
const common_1 = require("@nestjs/common");
let ManageUserList = class ManageUserList {
    constructor() {
        this.userList = {
            login: [],
            manager: [],
            working: [],
            done: [],
        };
    }
    updateUserListWithLogin(id) {
        const isWorking = this.getUser('working', id);
        const isDone = this.getUser('done', id);
        const { socketId } = this.getUser('login', id);
        if (isWorking)
            isWorking.socketId = socketId;
        if (isDone)
            isDone.socketId = socketId;
    }
    getUsers(room) {
        return [...this.userList[room]];
    }
    getUser(room, id) {
        return Object.assign({}, this.userList[room].find((user) => user.id === id));
    }
    isUserExist(room, id) {
        return this.userList[room].findIndex((user) => user.id === id) >= 0;
    }
    deleteUser(room, id) {
        const index = this.userList[room].findIndex((user) => user.id === id);
        if (index < 0)
            return false;
        this.userList[room].splice(index, 1);
        return true;
    }
    clearRoom(room) {
        this.userList[room] = [];
    }
    addUser({ room, userId, socketId, }) {
        const isExist = this.getUser(room, userId);
        if (Object.keys(isExist).length)
            return;
        this.userList[room].push({ id: userId, socketId });
    }
};
ManageUserList = __decorate([
    (0, common_1.Injectable)()
], ManageUserList);
exports.ManageUserList = ManageUserList;
//# sourceMappingURL=manageUserList.js.map