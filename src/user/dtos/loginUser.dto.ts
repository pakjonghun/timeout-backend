import { User } from './../entities/user.entity';
import { PickType } from '@nestjs/swagger';
export class LoginUserDto extends PickType(User, ['email', 'password']) {}
