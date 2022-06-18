import { Record } from 'src/record/entities/record.entity';
import { User } from 'src/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getManager } from 'typeorm';

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const id = request['user']['id'];

    const user = await getManager()
      .createQueryBuilder(User, 'u')
      .select('u.id', 'id')
      .addSelect('u.role', 'role')
      .addSelect(
        `
        IF(r.id IS NULL,
          null,
          JSON_OBJECT(
            'id', r.id,
            'startTime', r.startTime,
            'endTime', r.endTime,
            'description', r.description
          ))recordList`,
      )
      .leftJoin(
        (qb) => {
          const a = qb
            .select()
            .from(Record, 'r')
            .where(
              "DATE_FORMAT(r.startTime,'%Y-%m-%d')=DATE_FORMAT(NOW(),'%Y-%m-%d')",
            )
            .andWhere('r.endTime IS NULL')
            .orderBy('r.startTime', 'DESC');
          return a;
        },
        'r',
        'r.userId=u.id',
      )
      .where('u.id=:id', { id })
      .getRawOne();

    return user || null;
  },
);
