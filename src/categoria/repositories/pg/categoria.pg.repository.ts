import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaRepository } from '../categoria.repository';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { ICategoria } from 'src/categoria/entities/interfaces/categoria.interface';

export class CategoriaPgRepository implements CategoriaRepository {
  constructor(
    @InjectRepository(Categoria) private repository: Repository<Categoria>,
  ) {}

  async findAll(pagina: number, limite: number): Promise<ICategoria[]> {
    return this.repository.find({
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }

  async findById(id: string): Promise<ICategoria | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(categoria: ICategoria): Promise<void> {
    await this.repository.insert(categoria);
  }

  async update(categoria: ICategoria): Promise<void> {
    await this.repository.update({ id: categoria.id }, categoria);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
