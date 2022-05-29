import { hash, compare } from 'bcryptjs';
import { IsEmail, IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { Common } from 'src/common/entities/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

enum Role {
  'Manager' = 'Manager',
  'Client' = 'Client',
}

export type RoleType = keyof typeof Role;

@Entity()
export class User extends Common {
  @Column({ default: 'Client' })
  @IsOptional()
  @IsEnum(Role)
  role: RoleType;

  @Column({ select: false })
  @Length(2, 10, { message: '비밀번호는 3~10글자 입니다.' })
  password: string;

  @Column()
  @Length(2, 10, { message: '이름은 2~10글자 길이의 문자열 입니다.' })
  name: string;

  @Column({ unique: true })
  @IsEmail({}, { message: '이메일 형식을 지켜야 합니다.' })
  email: string;

  @Column({ unique: true, type: 'bigint' })
  @Matches(/^\d{11}$/, { message: '휴대폰 번호는 11자리 입니다.' })
  phone: number;

  @Column({ nullable: true })
  @IsOptional()
  avatar?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return compare(password, this.password);
  }
}
