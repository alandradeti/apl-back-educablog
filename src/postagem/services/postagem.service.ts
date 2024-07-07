import { Injectable, NotFoundException } from '@nestjs/common';
import { IPostagem } from '../entities/interfaces/postagem.interface';
import { PostagemRepository } from '../repositories/postagem.repository';

@Injectable()
export class PostagemService {
  constructor(private readonly repository: PostagemRepository) {}

  async findAll(limit: number, page: number): Promise<IPostagem[]> {
    return this.repository.findAll(limit, page);
  }

  async findById(id: string): Promise<IPostagem> {
    const postagem = await this.repository.findById(id);
    if (!postagem) throw new NotFoundException('Postagem não encontrada!');
    return postagem;
  }

  async create(postagem: IPostagem): Promise<IPostagem> {
    return await this.repository.create(postagem);
  }

  async update(postagem: IPostagem): Promise<IPostagem> {
    return await this.repository.update(postagem);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
