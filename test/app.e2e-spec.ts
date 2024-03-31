import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

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

  it('registers a new user', async () => {
    const res = await server.post('/users').send();
    expect(res.status).toBe(HttpStatus.CREATED);
  });
  describe('Users', () => {});
});
