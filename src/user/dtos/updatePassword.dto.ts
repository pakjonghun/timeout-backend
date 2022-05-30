import { CreateUserDto } from './createUser.dto';
import { PickType } from '@nestjs/swagger';
export class UpdatePasswordDto extends PickType(CreateUserDto, [
  'password',
  'passwordConfirm',
]) {}

export class UpdateUserPasswordDto extends PickType(CreateUserDto, [
  'password',
]) {}
