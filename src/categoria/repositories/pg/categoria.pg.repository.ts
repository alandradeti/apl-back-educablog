import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Categoria } from '../../entities/categoria.entity';
import { ICategoria } from '../../entities/interfaces/categoria.interface';
import { CategoriaRepository } from '../categoria.repository';

export class CategoriaPgRepository implements CategoriaRepository {
  constructor(
    @InjectRepository(Categoria) private repository: Repository<Categoria>,
  ) {}

  async findAll(limite: number, pagina: number): Promise<ICategoria[]> {
    const maxLimite = Math.min(limite, 50);

    return this.repository.find({
      skip: (pagina - 1) * maxLimite,
      take: limite,
    });
  }

  async findById(id: string): Promise<ICategoria | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(categoria: ICategoria): Promise<ICategoria | null> {
    return await this.repository.save(categoria);
  }

  async update(categoria: ICategoria): Promise<ICategoria | null> {
    return await this.repository.save(categoria);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
