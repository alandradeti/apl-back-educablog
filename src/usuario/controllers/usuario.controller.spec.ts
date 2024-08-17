import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app.module';
import { IUsuario } from '../entities/interfaces/usuario.interface';

describe('Usuario', () => {
  let app: INestApplication;
  let token: string | undefined;
  const usuario = {
    login: 'teste',
    senha: 'batman',
  } as IUsuario;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/usuario (POST)', async () => {
    const responseSignData = await request(app.getHttpServer())
      .post('/autenticacao/signin')
      .send({ login: 'admin', senha: 'admin' });
    token = responseSignData.body.token;

    const responseUsuarioData = await request(app.getHttpServer())
      .post('/usuario')
      .send(usuario);

    usuario.id = responseUsuarioData.text;
    expect(responseUsuarioData.statusCode).toBe(201);
  });

  it('/usuario (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/usuario/${usuario.id}`)
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });

  it('/usuario/:id (PUT)', async () => {
    usuario.senha = 'coringa';

    const response = await request(app.getHttpServer())
      .put(`/usuario/${usuario.id}`)
      .auth(token, {
        type: 'bearer',
      })
      .send(usuario);

    expect(response.statusCode).toBe(200);
  });

  it('/usuario (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/usuario/${usuario.id}`)
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });
});
