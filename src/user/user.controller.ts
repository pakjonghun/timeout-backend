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
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { PagnationDto } from 'src/common/dtos/pagnation.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { date } from 'joi';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

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

  @Role('Manager')
  @Get(':id')
  async findUser(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }

  @Role('Manager')
  @Get()
  async findAllUsers(@Query() query: PagnationDto) {
    return this.userService.findAllUsers(query);
  }

  @Role('Manager')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.removeUser(+id);
  }

  @Role('Any')
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      },
    });

    const fileName = Date.now() + file.originalname;

    await new AWS.S3()
      .putObject({
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Body: file.buffer,
        Key: fileName,
        ACL: 'public-read',
      })
      .promise();

    const url = `https://${this.configService.get(
      'S3_BUCKET_NAME',
    )}.s3.amazonaws.com/${fileName}`;
    return { url };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
