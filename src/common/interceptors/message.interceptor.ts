import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class MessageInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        if (data?.totalPage) {
          return data;
        } else {
          return Boolean(data)
            ? { data, message: 'success' }
            : { message: 'success' };
        }
      }),
    );
  }
}
