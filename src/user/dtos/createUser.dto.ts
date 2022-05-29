import { PickType } from '@nestjs/swagger';
import { IsSamePassword } from '../decorators/isSamePassword.decorator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'email',
  'name',
  'password',
  'phone',
]) {
  @IsSamePassword('password', {
    message: '비밀번호가 비밀번호 확인과 같지 않습니다.',
  })
  passwordConfirm: string;
}
