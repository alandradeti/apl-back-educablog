import { Injectable, NotFoundException } from '@nestjs/common';

import { IPost } from '../entities/interfaces/post.interface';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly repository: PostRepository) {}

  async findAll(
    limit: number,
    page: number,
  ): Promise<{ data: IPost[]; totalCount: number }> {
    return this.repository.findAll(limit, page);
  }

  async findAllActive(
    limit: number,
    page: number,
  ): Promise<{ data: IPost[]; totalCount: number }> {
    return this.repository.findAllActive(limit, page);
  }

  async findAllPostCategoria(
    limit: number,
    page: number,
    idCategoria: string,
  ): Promise<{ data: IPost[]; totalCount: number }> {
    const { data, totalCount } = await this.repository.findAllPostCategoria(
      limit,
      page,
      idCategoria,
    );
    if (!data || data.length === 0)
      throw new NotFoundException(
        'Post não encontrado com a categoria informada!',
      );
    return { data, totalCount };
  }

  async findById(id: string): Promise<IPost> {
    const post = await this.repository.findById(id);
    if (!post) throw new NotFoundException('Post não encontrado!');
    return post;
  }

  async search(
    query: string,
    includeInactive: boolean,
  ): Promise<{ data: IPost[]; totalCount: number }> {
    const { data, totalCount } = await this.repository.search(
      query,
      includeInactive,
    );

    if (!data || data.length === 0) {
      throw new NotFoundException('Nenhum post encontrado para a busca!');
    }

    return { data, totalCount };
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
