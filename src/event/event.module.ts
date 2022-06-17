import { ManageUserList } from './manageUserList';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [EventGateway, ManageUserList],
  exports: [EventGateway],
})
export class EventModule {}
