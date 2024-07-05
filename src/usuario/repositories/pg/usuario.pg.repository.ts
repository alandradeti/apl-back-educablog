import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioRepository } from '../usuario.repository';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { IUsuario } from 'src/usuario/entities/interfaces/usuario.interface';

export class UsuarioPgRepository implements UsuarioRepository {
  constructor(
    @InjectRepository(Usuario) private repository: Repository<Usuario>,
  ) {}

  async findAll(pagina: number, limite: number): Promise<IUsuario[]> {
    return this.repository.find({
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }

  async findById(id: string): Promise<IUsuario | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(usuario: IUsuario): Promise<void> {
    await this.repository.insert(usuario);
  }

  async update(usuario: IUsuario): Promise<void> {
    await this.repository.update({ id: usuario.id }, usuario);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
