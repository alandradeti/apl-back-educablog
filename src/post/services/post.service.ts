import { Injectable, NotFoundException } from '@nestjs/common';
import { IPost } from '../entities/interfaces/post.interface';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly repository: PostRepository) {}

  async findAll(limit: number, page: number): Promise<IPost[]> {
    return this.repository.findAll(limit, page);
  }

  async findAllActive(limit: number, page: number): Promise<IPost[]> {
    return this.repository.findAllActive(limit, page);
  }

  async findAllPostCategoria(
    limit: number,
    page: number,
    idCategoria: string,
  ): Promise<IPost[]> {
    const post = await this.repository.findAllPostCategoria(
      limit,
      page,
      idCategoria,
    );
    if (!post)
      throw new NotFoundException(
        'Post não encontrada com a categoria informada!',
      );
    return post;
  }

  async findById(id: string): Promise<IPost> {
    const post = await this.repository.findById(id);
    if (!post) throw new NotFoundException('Post não encontrada!');
    return post;
  }

  async search(query: string): Promise<IPost[]> {
    const postagens = await this.repository.search(query);
    if (!postagens || postagens.length === 0) {
      throw new NotFoundException('Nenhuma post encontrada para a busca!');
    }
    return postagens;
  }

  async create(post: IPost): Promise<IPost> {
    return await this.repository.create(post);
  }

  async update(post: IPost): Promise<IPost> {
    return await this.repository.update(post);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
