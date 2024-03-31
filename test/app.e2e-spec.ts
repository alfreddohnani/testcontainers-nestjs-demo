import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from '~/user/dto/create-user.dto';
import { User, UserTitle } from '~/user/entities/user.entity';
import { where } from 'typeorm-where';

describe('(e2e) Tests', () => {
  jest.setTimeout(1000 * 60 * 1);

  let app: INestApplication;
  let postgreSqlContainer: StartedPostgreSqlContainer;
  let server: request.SuperTest<request.Test>;

  beforeAll(async () => {
    postgreSqlContainer = await new PostgreSqlContainer()
      .withName('testcontainer-demo-api')
      .withDatabase('testcontainer_demo')
      .start();

    //update database environment variables in order for typeorm to connect to the testcontainer DB
    process.env.DB_HOST = postgreSqlContainer.getHost();
    process.env.DB_PORT = postgreSqlContainer.getPort().toString();
    process.env.DB_USERNAME = postgreSqlContainer.getUsername();
    process.env.DB_PASSWORD = postgreSqlContainer.getPassword();
    process.env.DB_NAME = postgreSqlContainer.getDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = request(app.getHttpServer());
  });

  afterAll(async () => {
    await postgreSqlContainer.stop();
    await app.close();
  });

  it('/ (GET)', () => {
    return server.get('/').expect(200).expect('Hello World!');
  });

  describe('Users', () => {
    const createUserDto: CreateUserRequestDto = {
      age: 23,
      firstName: 'Alfred',
      lastName: 'Doh-Nani',
      telephone: '233544700089',
      password: 'mysupersafepassword123',
      title: UserTitle.MR,
    };

    it('creates a new user account', async () => {
      const res = await server.post('/users').send(createUserDto);

      const body = res.body as CreateUserResponseDto;
      expect(res.status).toBe(HttpStatus.CREATED);
      expect(body.status).toBe(HttpStatus.CREATED);
      expect(body.error).toBeNull();
      expect(body.user.telephone).toBe(createUserDto.telephone);
    });

    it('hashes the password of the created user', async () => {
      const user = await User.findOne({
        where: where<User>({ telephone: { $equal: createUserDto.telephone } }),
      });

      expect(user).toBeDefined();
      expect(user.password).not.toBe(createUserDto.password);
    });

    it('throws error given a telephone number which already exists', async () => {
      const res = await server.post('/users').send({
        firstName: 'John',
        lastName: 'Doe',
        age: 34,
        password: 'doessecretpassword',
        telephone: createUserDto.telephone,
        title: UserTitle.MR,
      } satisfies CreateUserRequestDto);

      const body = res.body as CreateUserResponseDto;
      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(body.status).toBe(HttpStatus.FORBIDDEN);
      expect(body.error).toBe('The user already exists');
    });
  });
});
