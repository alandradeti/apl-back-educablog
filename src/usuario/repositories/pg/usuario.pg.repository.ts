import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UsuarioRepository } from '../usuario.repository';
import { IUsuario } from 'src/usuario/entities/interfaces/usuario.interface';

export class UsuarioPgRepository implements UsuarioRepository {
  constructor(
    @InjectRepository(Usuario) private repository: Repository<Usuario>,
  ) {}

  async findByLogin(login: string): Promise<IUsuario | null> {
    return await this.repository.findOne({
      where: { login: login },
    });
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
