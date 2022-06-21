"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
const record_entity_1 = require("../../record/entities/record.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
exports.GetUser = (0, common_1.createParamDecorator)(async (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request['user']['id'];
    const user = await (0, typeorm_1.getManager)()
        .createQueryBuilder(user_entity_1.User, 'u')
        .select('u.id', 'id')
        .addSelect('u.role', 'role')
        .addSelect('u.avatar', 'avatar')
        .addSelect('u.avatar2', 'avatar2')
        .addSelect(`
        IF(r.id IS NULL,
          null,
          JSON_OBJECT(
            'id', r.id,
            'startTime', r.startTime,
            'endTime', r.endTime,
            'description', r.description
          ))recordList`)
        .leftJoin((qb) => {
        const a = qb
            .select()
            .from(record_entity_1.Record, 'r')
            .where("DATE_FORMAT(r.startTime,'%Y-%m-%d')=DATE_FORMAT(NOW(),'%Y-%m-%d')")
            .andWhere('r.endTime IS NULL')
            .orderBy('r.startTime', 'DESC');
        return a;
    }, 'r', 'r.userId=u.id')
        .where('u.id=:id', { id })
        .getRawOne();
    return user || null;
});
//# sourceMappingURL=user.decorator.js.map