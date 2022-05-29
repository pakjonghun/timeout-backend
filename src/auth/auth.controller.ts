import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller()
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('/users/login')
  async login(@GetUser() user: User) {
    return user;
  }
}
