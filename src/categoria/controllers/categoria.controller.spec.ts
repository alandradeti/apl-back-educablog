import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app.module';
import { ICategoria } from '../entities/interfaces/categoria.interface';

describe('Categoria', () => {
  let app: INestApplication;
  let token: string | undefined;
  let categoria: ICategoria;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/categoria (POST)', async () => {
    const categoriaData = {
      nome: 'Categoria teste POST',
    } as ICategoria;

    const responseSignData = await request(app.getHttpServer())
      .post('/autenticacao/signin')
      .send({ login: 'admin', senha: 'admin' });
    token = responseSignData.body.token;

    const responseCategoriaData = await request(app.getHttpServer())
      .post('/categoria')
      .auth(token, {
        type: 'bearer',
      })
      .send(categoriaData);

    categoria = responseCategoriaData.body;

    expect(responseCategoriaData.statusCode).toBe(201);
    expect(responseCategoriaData.body).toEqual(
      expect.objectContaining(categoriaData),
    );
  });

  it('/categoria (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/categoria');

    expect(response.statusCode).toBe(200);
  });

  it('/categoria/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/categoria/${categoria.id}`)
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });

  it('/categoria/:id (PUT)', async () => {
    categoria.nome = 'Categoria teste PUT';

    const response = await request(app.getHttpServer())
      .put(`/categoria/${categoria.id}`)
      .auth(token, {
        type: 'bearer',
      })
      .send(categoria);

    expect(response.statusCode).toBe(200);
  });

  it('/categoria (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/categoria/${categoria.id}`)
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });
});
