import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly connection: Connection,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, phone, ...rest } = createUserDto;
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const user = await queryRunner.manager
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .orWhere('user.phone = :phone', { phone })
        .getCount();

      if (user) throw new BadRequestException('이미 있는 계정 입니다.');

      const { id } = await queryRunner.manager
        .getRepository(User)
        .save(this.userRepository.create({ ...rest, email, phone }));

      const createdUser = await queryRunner.manager
        .getRepository(User)
        .createQueryBuilder('u')
        .select('u.id')
        .addSelect(['u.email', 'u.name', 'u.role', 'u.phone'])
        .where('u.id = :id', { id })
        .getOne();

      await queryRunner.commitTransaction();

      return createdUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findUserInfoById(id: number) {
    return this.userRepository
      .createQueryBuilder('u')
      .select('u.id')
      .addSelect(['u.email', 'u.name', 'u.role', 'u.phone'])
      .where('u.id = :id', { id })
      .getOne();
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
