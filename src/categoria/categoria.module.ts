import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { CategoriaRepository } from './repositories/categoria.repository';
import { CategoriaPgRepository } from './repositories/pg/categoria.pg.repository';
import { CategoriaService } from './services/categoria.service';
import { CategoriaController } from './controllers/categoria.controller';
//import { PrometheusService } from 'src/shared/services/prometheus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  providers: [
    {
      provide: CategoriaRepository,
      useClass: CategoriaPgRepository,
    },
    CategoriaService,
    //PrometheusService,
  ],
  controllers: [CategoriaController],
})
export class CategoriaModule {}
