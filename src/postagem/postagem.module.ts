import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postagem } from './entities/postagem.entity';
import { PostagemPgRepository } from './repositories/pg/postagem.pg.repository';
import { PostagemController } from './controllers/postagem.controller';
import { PostagemService } from './services/postagem.service';
import { PostagemRepository } from './repositories/postagem.repository';
//import { PrometheusService } from 'src/shared/services/prometheus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Postagem])],
  providers: [
    {
      provide: PostagemRepository,
      useClass: PostagemPgRepository,
    },
    PostagemService,
    //PrometheusService,
  ],
  controllers: [PostagemController],
})
export class PostagemModule {}
