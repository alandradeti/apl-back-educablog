import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { IUsuario } from '../entities/interfaces/usuario.interface';

@Injectable()
export class UsuarioService {
  constructor(private readonly repository: UsuarioRepository) {}

  async findAll(limit: number, page: number): Promise<IUsuario[]> {
    return this.repository.findAll(limit, page);
  }

  async findById(id: string): Promise<IUsuario> {
    const usuario = await this.repository.findById(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado!');
    return usuario;
  }

  async create(usuario: IUsuario): Promise<void> {
    await this.repository.create(usuario);
  }

  async update(usuario: IUsuario): Promise<void> {
    await this.repository.update(usuario);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
