import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostPgRepository } from './repositories/pg/post.pg.repository';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { PostRepository } from './repositories/post.repository';
import { PrometheusService } from '../shared/services/prometheus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [
    {
      provide: PostRepository,
      useClass: PostPgRepository,
    },
    PostService,
    PrometheusService,
  ],
  controllers: [PostController],
})
export class PostModule {}
