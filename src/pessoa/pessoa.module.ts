import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaRepository } from './repositories/pessoa.repository';
import { PessoaPgRepository } from './repositories/pg/pessoa.pg.repository';
import { PessoaService } from './services/pessoa.service';
import { PessoaController } from './controllers/pessoa.controller';
import { PrometheusService } from 'src/shared/services/prometheus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])],
  providers: [
    {
      provide: PessoaRepository,
      useClass: PessoaPgRepository,
    },
    PessoaService,
    PrometheusService,
  ],
  controllers: [PessoaController],
})
export class PessoaModule {}
