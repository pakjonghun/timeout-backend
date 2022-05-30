import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['passwordConfirm', 'password']),
) {}
