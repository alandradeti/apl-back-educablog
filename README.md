<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash
# docker build
$ docker compose up --build
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Script DB

```sql
create extension if not exists "uuid-ossp";

drop table if exists post;
drop table if exists categoria;
drop table if exists usuario;
drop table if exists pessoa;

create table categoria
(
  id uuid primary key default uuid_generate_v4()
  ,nome varchar(100) not null
  ,constraint uq_nome unique (nome)
);

create table pessoa
(
  id uuid primary key default uuid_generate_v4()
  ,cpf varchar(11) not null
  ,nome varchar(255) not null
  ,email varchar(255) not null
  ,data_nascimento date not null
  ,telefone varchar(20) not null
  ,constraint uq_cpf unique (cpf)
);

create table usuario
(
  id uuid primary key default uuid_generate_v4()
  ,login varchar(255) not null
  ,senha varchar(255) not null
  ,tipo varchar(20) 
  ,id_pessoa uuid null
  ,constraint uq_login unique (login)
  ,constraint uq_pessoa_id unique (id_pessoa)
  ,constraint fk_pessoa_id foreign key (id_pessoa) references pessoa(id) on delete cascade
);

create table post
(
  id uuid primary key default uuid_generate_v4()
  ,titulo varchar(100) not null
  ,descricao varchar(1000) not null
  ,imagem_url varchar(1000) not null default ''
  ,ativo boolean not null default true
  ,id_usuario_criacao uuid not null
  ,data_criacao timestamp without time zone default now()
  ,id_usuario_atualizacao uuid not null
  ,data_atualizacao timestamp without time zone default now()
  ,id_categoria uuid null
  ,constraint fk_usuario_criacao_id foreign key (id_usuario_criacao) references usuario(id)
  ,constraint fk_usuario_atualizacao_id foreign key (id_usuario_atualizacao) references usuario(id)
  ,constraint fk_categoria_id foreign key (id_categoria) references categoria(id)
);

-- Usuário admin para usar na autenticação dos testes
insert into usuario (login, senha)
values ('admin', '$2a$08$irmxjBNXz3qco099PIxUo.zKhhLMYlUp5XlHqrL0BFZyAYwWM9OXi');

```
<!-- slide -->
