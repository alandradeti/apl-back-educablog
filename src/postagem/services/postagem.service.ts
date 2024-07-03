import { Injectable, NotFoundException } from '@nestjs/common';
import { IPostagem } from '../entities/interfaces/postagem.interface';
import { PostagemRepository } from '../repositories/postagem.repository';

@Injectable()
export class PostagemService {
  constructor(private readonly postagemRepository: PostagemRepository) {}

  async findAll(limit: number, page: number): Promise<IPostagem[]> {
    return this.postagemRepository.findAll(limit, page);
  }

  async findById(id: string): Promise<IPostagem> {
    const postagem = await this.postagemRepository.findById(id);
    if (!postagem) throw new NotFoundException('Postagem não encontrada!');
    return postagem;
  }

  async create(postagem: IPostagem): Promise<void> {
    await this.postagemRepository.create(postagem);
  }

  async update(postagem: IPostagem): Promise<void> {
    await this.postagemRepository.update(postagem);
  }

  async delete(id: string): Promise<void> {
    await this.postagemRepository.delete(id);
  }
}
