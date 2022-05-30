import { Record } from 'src/record/entities/record.entity';
import { User } from 'src/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getManager } from 'typeorm';

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const id = request['user']['id'];

    const result = await getManager()
      .createQueryBuilder()
      .select('u.id')
      .addSelect('u.email', 'email')
      .addSelect('u.phone', 'phone')
      .addSelect('u.role', 'role')
      .addSelect('u.avatar', 'avatar')
      .addSelect(
        'JSON_OBJECT("id",r.id,"startTime",r.startTime)',
        'todayRecord',
      )
      .innerJoin((qb) => qb.select().from(Record, 'r'), 'r', 'r.userId=u.id')
      .from(User, 'u')
      .where('u.id=:id', { id })
      .getRawOne();

    return result;
  },
);
