import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app.module';
import { IPessoa } from '../entities/interfaces/pessoa.interface';

describe('Pessoa', () => {
  let app: INestApplication;
  let token: string | undefined;
  let pessoa: IPessoa;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/pessoa (POST)', async () => {
    const pessoaData = {
      cpf: '778.103.558-56',
      nome: 'Pedro Henrique João Corte Real',
      email: 'pedro.henrique.cortereal@akto.com.br',
      dataNascimento: new Date('2000-05-09'),
      telefone: '(16) 98522-2412',
    } as IPessoa;

    const responseSignData = await request(app.getHttpServer())
      .post('/autenticacao/signin')
      .send({ login: 'admin', senha: 'admin' });
    token = responseSignData.body.token;

    const responsePessoaData = await request(app.getHttpServer())
      .post('/pessoa')
      .auth(token, {
        type: 'bearer',
      })
      .send(pessoaData);

    pessoa = responsePessoaData.body;

    expect(responsePessoaData.statusCode).toBe(201);
  });

  it('/pessoa (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/pessoa')
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });

  it('/pessoa/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/pessoa/${pessoa.id}`)
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });

  it('/pessoa/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/pessoa/${pessoa.id}`)
      .auth(token, {
        type: 'bearer',
      })
      .send(pessoa);

    expect(response.statusCode).toBe(200);
  });

  it('/pessoa (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/pessoa/${pessoa.id}`)
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });
});
