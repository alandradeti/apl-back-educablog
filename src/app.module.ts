import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PessoaModule } from './pessoa/pessoa.module';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST_DATABASE,
      port: Number(process.env.PORT_DATABASE),
      username: process.env.USER_DATABASE,
      password: process.env.PASS_DATABASE,
      database: process.env.NAME_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
      ssl:
        process.env.VERIFY_SSL_DATABASE === 'true'
          ? { rejectUnauthorized: false }
          : false,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETS,
      signOptions: {
        expiresIn: parseInt(
          process.env.TOKEN_EXPIRATION_TIME || '86400000',
          10,
        ),
      },
    }),
    PostModule,
    PessoaModule,
    CategoriaModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
