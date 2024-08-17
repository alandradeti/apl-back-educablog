import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../app.module';
import { IPost } from '../entities/interfaces/post.interface';

describe('Post API', () => {
  let app: INestApplication;
  let token: string | undefined;
  let post: IPost;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/posts (POST)', async () => {
    const postData = {
      titulo: 'string',
      descricao: 'string',
      imagemUrl: 'string',
      ativo: true,
    } as IPost;

    const responseSignData = await request(app.getHttpServer())
      .post('/autenticacao/signin')
      .send({ login: 'admin', senha: 'admin' });
    token = responseSignData.body.token;

    const createPostResponse = await request(app.getHttpServer())
      .post('/posts')
      .auth(token, {
        type: 'bearer',
      })
      .send(postData);

    post = createPostResponse.body;

    expect(createPostResponse.statusCode).toBe(201);
    expect(createPostResponse.body).toEqual(expect.objectContaining(postData));
  });

  it('/posts (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/posts');

    expect(response.statusCode).toBe(200);
  });

  it('/posts/admin (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/posts/admin')
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });

  it('/posts/search (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      '/posts?search=string',
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/posts/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      `/posts/${post.id}`,
    );

    expect(response.statusCode).toBe(200);
  });

  it('/posts/:id (PUT)', async () => {
    post.ativo = false;
    const response = await request(app.getHttpServer())
      .put(`/posts/${post.id}`)
      .auth(token, {
        type: 'bearer',
      })
      .send(post);

    expect(response.statusCode).toBe(200);
  });

  it('/posts (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .auth(token, {
        type: 'bearer',
      });

    expect(response.statusCode).toBe(200);
  });
});
