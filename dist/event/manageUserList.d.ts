declare type UserListRoom = 'login' | 'manager' | 'working' | 'done';
declare type UserOfUserList = {
    id: number;
    socketId: string;
};
export declare class ManageUserList {
    userList: Record<UserListRoom, UserOfUserList[]>;
    getUsers(room: UserListRoom): UserOfUserList[];
    getUser(room: UserListRoom, id: number): {
        id: number;
        socketId: string;
    };
    isUserExist(room: UserListRoom, id: number): boolean;
    deleteUser(room: UserListRoom, id: number): boolean;
    clearRoom(room: UserListRoom): void;
    addUser({ room, userId, socketId, }: {
        room: UserListRoom;
        userId: number;
        socketId: string;
    }): void;
}
export {};
