import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST_TEST,
  port: +process.env.POSTGRES_PORT_TEST,
  username: process.env.POSTGRES_USER_TEST,
  password: process.env.POSTGRES_PASSWORD_TEST,
  database: process.env.POSTGRES_DB_TEST,
  entities: ['../**/*.entity.ts'],
  synchronize: true,
  dropSchema: true,
};

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, TypeOrmModule.forRoot(dataSourceOptions)],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'john@email.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '',
      })
      .expect(201)
      .expect({
        id: 1,
        external_id: null,
        email: 'john@email.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: '',
      });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([
        {
          id: 1,
          external_id: null,
          email: 'john@email.com',
          first_name: 'John',
          last_name: 'Doe',
          avatar: '',
        },
      ]);
  });

  it('/users/1 (GET)', () => {
    return request(app.getHttpServer()).get('/users/1').expect(200).expect({
      id: 1,
      external_id: null,
      email: 'john@email.com',
      first_name: 'John',
      last_name: 'Doe',
      avatar: '',
    });
  });

  it('/users/1 (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/users/1')
      .send({
        avatar: 'avatar.png',
      })
      .expect(200)
      .expect({
        id: 1,
        external_id: null,
        email: 'john@email.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'avatar.png',
      });
  });

  it('/users/1 (DELETE)', async () => {
    await request(app.getHttpServer()).delete('/users/1').expect(200);

    return request(app.getHttpServer()).get('/users/1').expect(200).expect({});
  });
});
