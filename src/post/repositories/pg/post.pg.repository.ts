import { IPost } from 'src/post/entities/interfaces/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';
import { PostRepository } from '../post.repository';

export class PostPgRepository implements PostRepository {
  constructor(@InjectRepository(Post) private repository: Repository<Post>) {}

  async findAll(limite: number, pagina: number): Promise<IPost[] | null> {
    const maxLimite = Math.min(limite, 50);

    return this.repository.find({
      relations: ['categoria'],
      skip: (pagina - 1) * maxLimite,
      take: limite,
    });
  }

  async findAllActive(limite: number, pagina: number): Promise<IPost[] | null> {
    const maxLimite = Math.min(limite, 50);

    return this.repository.find({
      relations: ['categoria'],
      where: { ativo: true },
      skip: (pagina - 1) * maxLimite,
      take: limite,
    });
  }

  async findAllPostCategoria(
    pagina: number,
    limite: number,
    idCategoria: string,
  ): Promise<IPost[]> {
    return this.repository.find({
      relations: ['categoria'],
      where: { categoria: { id: idCategoria } },
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }

  async findById(id: string): Promise<IPost | null> {
    return await this.repository.findOne({
      relations: ['categoria'],
      where: { id },
    });
  }

  async search(query: string): Promise<IPost[] | null> {
    return await this.repository
      .createQueryBuilder('post')
      .where('post.ativo = :ativo', { ativo: true })
      .andWhere('post.titulo ILIKE :query', { query: `%${query}%` })
      .orWhere('post.descricao ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async create(post: IPost): Promise<IPost | null> {
    return await this.repository.save(post);
  }

  async update(post: IPost): Promise<IPost | null> {
    console.log(post);
    return await this.repository.save(post);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
