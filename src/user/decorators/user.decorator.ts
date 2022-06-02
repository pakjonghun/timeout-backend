import { Record } from 'src/record/entities/record.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getManager } from 'typeorm';

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const id = request['user']['id'];

    const record = await getManager()
      .createQueryBuilder()
      .select('r.id', 'id')
      .addSelect('r.startTime', 'startTime')
      .addSelect('r.endTime', 'endTime')
      .addSelect('r.description', 'description')
      .from(Record, 'r')
      .innerJoin('r.user', 'user')
      .where(
        "DATE_FORMAT(CURDATE(), '%Y-%m-%d')=DATE_FORMAT(r.createdAt,'%Y-%m-%d')",
      )
      .andWhere('r.userId=:id', { id })
      .orderBy('r.startTime', 'DESC')
      .limit(1)
      .getRawOne();

    const result = { ...request['user'], record };
    return result;
  },
);
