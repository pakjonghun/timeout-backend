import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../entities/user.entity';

export const Role = (role: RoleType | 'Any') => SetMetadata('role', role);
