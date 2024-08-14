import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app.module';
import { IUsuario } from '../entities/interfaces/usuario.interface';

describe('Autenticacao', () => {
  let app: INestApplication;
  let token: string | undefined;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/autenticacao/signin (POST)', async () => {
    const siginData = {
      login: 'admin',
      senha: 'admin',
    } as IUsuario;

    const responseSignData = await request(app.getHttpServer())
      .post('/autenticacao/signin')
      .send(siginData);

    token = responseSignData.body.token;

    expect(responseSignData.statusCode).toBe(201);
  });

  it('/autenticacao/perfil (GET)', async () => {
    const responseSignData = await request(app.getHttpServer())
      .get('/autenticacao/perfil')
      .auth(token, {
        type: 'bearer',
      });
    expect(responseSignData.statusCode).toBe(200);
  });
});
