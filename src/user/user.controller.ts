import { GetUser } from 'src/user/decorators/user.decorator';
import { Role } from './decorators/role.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { PagnationDto } from 'src/common/dtos/pagnation.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Role('Any')
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const token = await this.userService.login(loginUserDto);
    res.cookie('jwt', token, { httpOnly: true });
  }

  @Role('Any')
  @Get('me')
  async me(@GetUser() user: User) {
    return user;
  }

  @Role('Client')
  @Get()
  async findAllUsers(@Query() query: PagnationDto) {
    return this.userService.findAllUsers(query);
  }

  @Role('Manager')
  @Get(':id')
  findUser(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
