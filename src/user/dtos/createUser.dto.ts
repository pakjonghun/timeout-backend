import { Role } from '../entities/user.entity';
import { RoleType } from './../entities/user.entity';
import { PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsSamePassword } from '../decorators/isSamePassword.decorator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'email',
  'name',
  'password',
  'phone',
]) {
  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsEnum(Role, { message: '유저 역할타입을 지켜주세요' })
  role: RoleType;

  @IsSamePassword('password', {
    message: '비밀번호가 비밀번호 확인과 같지 않습니다.',
  })
  passwordConfirm: string;
}
