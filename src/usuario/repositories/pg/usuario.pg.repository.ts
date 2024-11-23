import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUsuario } from '../../entities/interfaces/usuario.interface';
import { Usuario } from '../../entities/usuario.entity';
import { UsuarioRepository } from '../usuario.repository';

export class UsuarioPgRepository implements UsuarioRepository {
  constructor(
    @InjectRepository(Usuario) private repository: Repository<Usuario>,
  ) {}

  async findAll(
    limite: number,
    pagina: number,
  ): Promise<{ usuarios: IUsuario[]; totalCount: number } | null> {
    const maxLimite = Math.min(limite, 50);

    const [usuarios, totalCount] = await this.repository.findAndCount({
      relations: ['pessoa'],
      skip: (pagina - 1) * maxLimite,
      take: maxLimite,
    });

    return { usuarios, totalCount };
  }

  async findByLogin(login: string): Promise<IUsuario | null> {
    return await this.repository.findOne({
      where: { login: login },
    });
  }

  async findByTipo(
    tipo: string,
  ): Promise<{ usuarios: IUsuario[]; totalCount: number } | null> {
    const [usuarios, totalCount] = await this.repository.findAndCount({
      where: { tipo: tipo },
      relations: ['pessoa'],
    });
    return { usuarios, totalCount };
  }

  async findById(id: string): Promise<IUsuario | null> {
    return await this.repository.findOne({
      relations: ['pessoa'],
      where: { id },
    });
  }

  async create(usuario: IUsuario): Promise<string> {
    const retornoUsuario = await this.repository.save(usuario);
    return retornoUsuario.id;
  }

  async update(usuario: IUsuario): Promise<string> {
    const retornoUsuario = await this.repository.save(usuario);
    return retornoUsuario.id;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
