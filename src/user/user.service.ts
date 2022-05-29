import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/loginUser.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { PagnationDto } from 'src/common/dtos/pagnation.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.findUserByEmail(email);
    if (!user) throw new NotFoundException('유저가 없습니다.');
    if (!(await user.comparePassword(password))) {
      throw new BadRequestException('비밀번호 오류입니다.');
    }

    return this.jwtService.sign({ id: user.id, role: user.role });
  }

  async findUserInfoById(id: number) {
    return this.userRepository
      .createQueryBuilder('u')
      .select('u.id')
      .addSelect(['u.email', 'u.name', 'u.role', 'u.phone'])
      .where('u.id = :id', { id })
      .getOne();
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne(
      { email },
      { select: ['password', 'id', 'role'] },
    );
  }

  async findUserById(id: number) {
    return this.userRepository.findOne(id);
  }

  async findAllUsers(query: PagnationDto) {
    const { page, perPage } = query;
    const [users, totalCount] = await this.userRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      select: ['avatar', 'email', 'phone', 'name', 'role'],
    });

    return { users, totalCount, totalPage: Math.ceil(totalCount / perPage) };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
