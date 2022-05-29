import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, phone, ...rest } = createUserDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .orWhere('user.phone = :phone', { phone })
      .getCount();

    if (user) throw new BadRequestException('이미 있는 계정 입니다.');

    const { id } = await this.userRepository.save(
      this.userRepository.create({ ...rest, email, phone }),
    );

    return this.findUserInfoById(id);
  }

  async findUserInfoById(id: number) {
    return this.userRepository
      .createQueryBuilder('u')
      .select('u.id')
      .addSelect(['u.email', 'u.name', 'u.role', 'u.phone'])
      .where('u.id = :id', { id })
      .getOne();
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne(
      { email },
      { select: ['password', 'id', 'role'] },
    );
  }

  async findOneById(id: number) {
    return this.userRepository.findOne(id);
  }

  findAll() {
    return `This action returns all user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
