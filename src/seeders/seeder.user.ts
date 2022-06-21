import { RecordService } from './../record/record.service';
import { NestFactory } from '@nestjs/core';
import { faker } from '@faker-js/faker';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const recordService = app.get(RecordService);

  const me = await userService.create({
    phone: String(Math.floor(Math.random() * 89000000000) + 100000000000),
    avatar: faker.image.avatar(),
    name: faker.name.firstName(),
    password: '123',
    passwordConfirm: '123',
    email: 'client@email.com',
    role: 'Client',
  });

  async function createRecord(user: User) {
    try {
      const temp = faker.date.past();
      const y = temp.getFullYear();
      const m = temp.getMonth();
      const d = temp.getDate();

      const minute = Math.floor(Math.random() * 58 - 1) + 1;
      const startTime = new Date(`${y}-${m}=${d} 19:${minute}`);
      if (isNaN(startTime.getDate())) return;

      const duration = Math.floor(Math.random() * 120 - 3) + 120;

      const endTime = new Date(
        new Date(startTime).getTime() + 1000 * 60 * duration,
      );
      if (isNaN(endTime.getDate())) return;

      await recordService.create({
        user,
        endTime,
        startTime,
      });
    } catch (e) {
      return;
      console.error(e);
    }
  }

  for (let i = 0; i < 50; i++) {
    createRecord(me);
  }

  const senior = await userService.create({
    phone: String(Math.floor(Math.random() * 89000000000) + 100000000000),
    avatar: faker.image.avatar(),
    name: faker.name.firstName(),
    password: '123',
    passwordConfirm: '123',
    email: 'manager@email.com',
    role: 'Manager',
  });

  for (let i = 0; i < 50; i++) {
    createRecord(senior);
  }

  for (let i = 0; i < 30; i++) {
    const client = await userService.create({
      phone: String(Math.floor(Math.random() * 89000000000) + 100000000000),
      avatar: faker.image.avatar(),
      name: faker.name.firstName(),
      password: '123',
      passwordConfirm: '123',
      email: faker.internet.email(),
      role: 'Client',
    });

    for (let i = 0; i < 50; i++) {
      createRecord(client);
    }

    const manager = await userService.create({
      phone: String(Math.floor(Math.random() * 89000000000) + 100000000000),
      avatar: faker.image.avatar(),
      name: faker.name.firstName(),
      password: '123',
      passwordConfirm: '123',
      email: faker.internet.email(),
      role: 'Manager',
    });

    for (let i = 0; i < 50; i++) {
      createRecord(manager);
    }
  }

  process.exit();
}
bootstrap();
