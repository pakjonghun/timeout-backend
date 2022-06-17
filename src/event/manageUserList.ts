import { Injectable } from '@nestjs/common';

type UserListRoom = 'login' | 'manager' | 'working' | 'done';
type UserOfUserList = { id: number; socketId: string };

@Injectable()
export class ManageUserList {
  private userList: Record<UserListRoom, UserOfUserList[]> = {
    login: [],
    manager: [],
    working: [],
    done: [],
  };

  getUsers(room: UserListRoom) {
    console.log(this.userList);
    return [...this.userList[room]];
  }

  getUser(room: UserListRoom, id: number) {
    return { ...this.userList[room].find((user) => user.id === id) };
  }

  isUserExist(room: UserListRoom, id: number) {
    return this.userList[room].findIndex((user) => user.id === id) >= 0;
  }

  deleteUser(room: UserListRoom, id: number) {
    const index = this.userList[room].findIndex((user) => user.id === id);
    if (index < 0) return false;
    this.userList[room].splice(index, 1);
    return true;
  }

  clearRoom(room: UserListRoom) {
    this.userList[room] = [];
  }

  addUser({
    room,
    userId,
    socketId,
  }: {
    room: UserListRoom;
    userId: number;
    socketId: string;
  }) {
    this.userList[room].push({ id: userId, socketId });
  }
}
