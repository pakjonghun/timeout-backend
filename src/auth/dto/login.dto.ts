import { User } from './../../user/entities/user.entity';
import { PickType } from '@nestjs/swagger';
export class LoginDto extends PickType(User, ['email', 'password']) {}
