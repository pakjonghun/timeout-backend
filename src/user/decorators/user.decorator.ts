import { Record } from 'src/record/entities/record.entity';
import { User } from 'src/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getManager } from 'typeorm';

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const id = request['user']['id'];

    const record = await getManager()
      .createQueryBuilder()
      .select(['r.id', 'r.startTime', 'r.endTime'])
      .from(Record, 'r')
      .innerJoin('r.user', 'user')
      .where(
        "DATE_FORMAT(CURDATE(), '%Y-%m-%d')=DATE_FORMAT(r.startTime,'%Y-%m-%d')",
      )
      .andWhere('r.userId=:id', { id })
      .orderBy('r.startTime', 'DESC')
      .limit(1)
      .getRawOne();

    const result = { ...request['user'], record };
    return result;
  },
);
