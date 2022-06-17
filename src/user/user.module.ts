import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule, EventModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
