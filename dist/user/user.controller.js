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
exports.UserController = void 0;
const user_entity_1 = require("../user/entities/user.entity");
const user_decorator_1 = require("../user/decorators/user.decorator");
const role_decorator_1 = require("./decorators/role.decorator");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const createUser_dto_1 = require("./dtos/createUser.dto");
const updateUser_dto_1 = require("./dtos/updateUser.dto");
const loginUser_dto_1 = require("./dtos/loginUser.dto");
const user_entity_2 = require("./entities/user.entity");
const pagnation_dto_1 = require("../common/dtos/pagnation.dto");
const platform_express_1 = require("@nestjs/platform-express");
const AWS = require("aws-sdk");
const config_1 = require("@nestjs/config");
const updatePassword_dto_1 = require("./dtos/updatePassword.dto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let UserController = class UserController {
    constructor(userService, configService, userRepository) {
        this.userService = userService;
        this.configService = configService;
        this.userRepository = userRepository;
    }
    async getPrivateInfo(user) {
        return this.userService.getPrivateInfo(user.id);
    }
    async create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    async logout(res) {
        res.clearCookie('jwt');
    }
    async login(key, res, loginUserDto) {
        const { token, user } = await this.userService.login(loginUserDto, key);
        res.cookie('jwt', token, { httpOnly: true });
        return { id: user.id, role: user.role };
    }
    async me(user) {
        if (!user)
            throw new common_1.UnauthorizedException('잘못된 쿠키 토큰 입니다.');
        return user;
    }
    async updateMyProfile(user, updateUserDto) {
        return this.userService.updateUserProfile(user.id, updateUserDto);
    }
    async updateMyPassword(user, updatePasswordDto) {
        return this.userService.updateMyPassword(user.id, updatePasswordDto);
    }
    async updateUserPassword(id, updateUserPasswordDto) {
        return this.userService.updateUserPassword(id, updateUserPasswordDto);
    }
    async updateUserProfile(id, updateUserDto) {
        return this.userService.updateUserProfile(id, updateUserDto);
    }
    async findUser(id) {
        return this.userService.findUserById(id);
    }
    async findAllUsers(query) {
        return this.userService.findAllUsers(query);
    }
    async remove(id) {
        await this.userService.removeUser(+id);
    }
    async uploadAvatar(file, user) {
        if (!file)
            throw new common_1.BadRequestException('');
        AWS.config.update({
            credentials: {
                accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
                secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
            },
            region: 'ap-northeast-2',
        });
        const fileName = Date.now() + file.originalname;
        await new AWS.S3()
            .putObject({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Body: file.buffer,
            Key: `original/${fileName}`,
        })
            .promise();
        const makrUrl = (path) => {
            return `https://${this.configService.get('AWS_S3_BUCKET_NAME')}.s3.ap-northeast-2.amazonaws.com/${path}/${fileName}`;
        };
        const original = makrUrl('original');
        const resized = makrUrl('resize');
        const isExist = await this.userRepository.count({ id: user.id });
        if (!isExist)
            throw new common_1.NotFoundException('사용자가 없습니다.');
        await this.userRepository.save({
            id: user.id,
            avatar: original,
            avatar2: resized,
        });
        return { original, resized };
    }
};
__decorate([
    (0, role_decorator_1.Role)('Any'),
    (0, common_1.Get)('private'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPrivateInfo", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, role_decorator_1.Role)('Any'),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Query)('key')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, loginUser_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, role_decorator_1.Role)('Any'),
    (0, common_1.Get)('me'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
__decorate([
    (0, role_decorator_1.Role)('Any'),
    (0, common_1.Patch)(),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        updateUser_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyProfile", null);
__decorate([
    (0, role_decorator_1.Role)('Any'),
    (0, common_1.Patch)('password'),
    __param(0, (0, user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        updatePassword_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyPassword", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updatePassword_dto_1.UpdateUserPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserPassword", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateUser_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserProfile", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUser", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagnation_dto_1.PagnationDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUsers", null);
__decorate([
    (0, role_decorator_1.Role)('Manager'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', { limits: { fileSize: 2 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadAvatar", null);
UserController = __decorate([
    (0, common_1.Controller)('users'),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_2.User)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService,
        typeorm_2.Repository])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map