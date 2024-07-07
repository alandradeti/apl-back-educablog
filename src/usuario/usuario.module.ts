import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioRepository } from './repositories/usuario.repository';
import { UsuarioPgRepository } from './repositories/pg/usuario.pg.repository';
import { UsuarioService } from './services/usuario.service';
import { UsuarioController } from './controllers/usuario.controller';
import { PrometheusService } from 'src/shared/services/prometheus.service';
import { SigInController } from './controllers/sigin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [
    {
      provide: UsuarioRepository,
      useClass: UsuarioPgRepository,
    },
    UsuarioService,
    PrometheusService,
  ],
  controllers: [UsuarioController, SigInController],
})
export class UsuarioModule {}
