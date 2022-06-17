import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
export class SocketLoginDto extends PickType(User, ['id', 'role']) {}
