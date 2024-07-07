import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriaRepository } from '../repositories/categoria.repository';
import { ICategoria } from '../entities/interfaces/categoria.interface';

@Injectable()
export class CategoriaService {
  constructor(private readonly repository: CategoriaRepository) {}

  async findAll(limit: number, page: number): Promise<ICategoria[]> {
    return this.repository.findAll(limit, page);
  }

  async findById(id: number): Promise<ICategoria> {
    const categoria = await this.repository.findById(id);
    if (!categoria) throw new NotFoundException('Categoria não encontrada!');
    return categoria;
  }

  async create(categoria: ICategoria): Promise<void> {
    await this.repository.create(categoria);
  }

  async update(categoria: ICategoria): Promise<void> {
    await this.repository.update(categoria);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
