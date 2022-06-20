import { EventGateway } from 'src/event/event.gateway';
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
import { UpdateUserDto } from './dtos/updateUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { PagnationDto } from 'src/common/dtos/pagnation.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import {
  UpdatePasswordDto,
  UpdateUserPasswordDto,
} from './dtos/updatePassword.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Role('Any')
  @Get('private')
  async getPrivateInfo(@GetUser() user: User) {
    return this.userService.getPrivateInfo(user.id);
  }

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
    @Query('key') key: string,
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const { token, user } = await this.userService.login(loginUserDto, key);
    res.cookie('jwt', token, { httpOnly: true });
    return { id: user.id, role: user.role };
  }

  @Role('Any')
  @Get('me')
  async me(@GetUser() user: User) {
    return user;
  }

  @Role('Any')
  @Patch()
  async updateMyProfile(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserProfile(user.id, updateUserDto);
  }

  @Role('Any')
  @Patch('password')
  async updateMyPassword(
    @GetUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updateMyPassword(user.id, updatePasswordDto);
  }

  @Role('Manager')
  @Patch()
  async updateUserPassword(
    @Param('id') id: number,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPassword(id, updateUserPasswordDto);
  }

  @Role('Manager')
  @Patch()
  async updateUserProfile(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserProfile(id, updateUserDto);
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

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
      region: 'ap-northeast-2',
    });

    const fileName = Date.now() + file.originalname;
    await new AWS.S3()
      .putObject({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Body: file.buffer,
        Key: `original/${fileName}`,
      })
      .promise();

    const makrUrl = (path: string) => {
      return `https://${this.configService.get(
        'AWS_S3_BUCKET_NAME',
      )}.s3.amazonaws.com/${path}/${fileName}`;
    };

    return { original: makrUrl('original'), resized: makrUrl('resized') };
  }
}
