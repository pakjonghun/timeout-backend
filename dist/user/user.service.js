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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const event_gateway_1 = require("../event/event.gateway");
let UserService = class UserService {
    constructor(userRepository, jwtService, eventGateway) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.eventGateway = eventGateway;
    }
    async create(createUserDto) {
        const { email, phone } = createUserDto, rest = __rest(createUserDto, ["email", "phone"]);
        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .orWhere('user.phone = :phone', { phone })
            .getCount();
        if (user)
            throw new common_1.BadRequestException('이미 있는 계정 입니다.');
        const { id } = await this.userRepository.save(this.userRepository.create(Object.assign(Object.assign({}, rest), { email, phone })));
        return this.findUserInfoById(id);
    }
    async login(loginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.findUserByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('유저가 없습니다.');
        if (!(await user.comparePassword(password))) {
            throw new common_1.BadRequestException('비밀번호 오류입니다.');
        }
        const token = await this.jwtService.signAsync({
            id: user.id,
            role: user.role,
        });
        return { token, user };
    }
    async getLoginManager(idList) {
        this.eventGateway.getLoginManagerIdList();
        return this.userRepository
            .createQueryBuilder('u')
            .select('u.name', 'u.role')
            .where('u.id IN (:...idList)', { idList: Array.from(idList) })
            .getMany();
    }
    async findUserInfoById(id) {
        return this.userRepository
            .createQueryBuilder('u')
            .select('u.id')
            .addSelect(['u.email', 'u.name', 'u.role', 'u.phone'])
            .where('u.id = :id', { id })
            .getOne();
    }
    async findUserByEmail(email) {
        return this.userRepository.findOne({ email }, { select: ['password', 'id', 'role'] });
    }
    async findUserById(id) {
        return this.userRepository.findOne({ id }, { select: ['avatar', 'email', 'name', 'phone', 'role'] });
    }
    async findAllUsers(query) {
        const { page, perPage } = query;
        const [users, totalCount] = await this.userRepository.findAndCount({
            skip: (page - 1) * perPage,
            take: perPage,
            select: ['avatar', 'email', 'phone', 'name', 'role'],
        });
        return {
            users,
            totalCount,
            totalPage: Math.ceil(totalCount / perPage),
            message: 'succses',
        };
    }
    async removeUser(id) {
        const user = await this.findUserById(id);
        if (!user)
            throw new common_1.NotFoundException('존재하지 않는 사용자 입니다.');
        return this.userRepository.delete({ id });
    }
    async updateUserProfile(id, updateUserDto) {
        const { email, phone } = updateUserDto;
        const user = await this.findUserById(id);
        if (!user)
            throw new common_1.NotFoundException('존재하지 않는 사용자 입니다.');
        const isExist = await this.userRepository
            .createQueryBuilder('u')
            .select(['u.id', 'u.email', 'u.phone'])
            .where('u.email=:email OR u.phone=:phone', { email, phone })
            .getCount();
        if (isExist)
            throw new common_1.BadRequestException('폰번호나 이메일이 이미 존재합니다.');
        return this.userRepository.save(Object.assign({ id }, updateUserDto));
    }
    async updateMyPassword(id, { password }) {
        const user = await this.findUserById(id);
        if (!user)
            throw new common_1.NotFoundException('존재하지 않는 사용자 입니다.');
        const userObject = this.userRepository.create({ id, password });
        return this.userRepository.save(userObject);
    }
    async updateUserPassword(id, { password }) {
        const user = await this.findUserById(id);
        if (!user)
            throw new common_1.NotFoundException('존재하지 않는 사용자 입니다.');
        return this.userRepository.save({ id, password });
    }
    async getPrivateInfo(id) {
        const user = await this.userRepository
            .createQueryBuilder('u')
            .select(['u.id', 'u.email', 'u.phone', 'u.name'])
            .where('u.id=:id', { id })
            .getOne();
        if (!user)
            throw new common_1.NotFoundException('없는 유저 입니다.');
        return user;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        event_gateway_1.EventGateway])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map