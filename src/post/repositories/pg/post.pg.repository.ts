import { IPost } from 'src/post/entities/interfaces/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { Repository } from 'typeorm';
import { PostRepository } from '../post.repository';

export class PostPgRepository implements PostRepository {
  constructor(@InjectRepository(Post) private repository: Repository<Post>) {}

  async findAll(
    limite: number,
    pagina: number,
  ): Promise<{ data: IPost[]; totalCount: number } | null> {
    const maxLimite = Math.min(limite, 50);

    const [data, totalCount] = await this.repository.findAndCount({
      relations: ['categoria', 'usuarioCriacao', 'usuarioAtualizacao'],
      select: {
        usuarioCriacao: {
          id: true,
          login: true,
        },
        usuarioAtualizacao: {
          id: true,
          login: true,
        },
      },
      skip: (pagina - 1) * maxLimite,
      take: maxLimite,
    });

    return { data, totalCount };
  }

  async findAllActive(
    limite: number,
    pagina: number,
  ): Promise<{ data: IPost[]; totalCount: number } | null> {
    const maxLimite = Math.min(limite, 50);

    const [data, totalCount] = await this.repository.findAndCount({
      relations: ['categoria'],
      where: { ativo: true },
      skip: (pagina - 1) * maxLimite,
      take: maxLimite,
    });

    return { data, totalCount };
  }

  async findAllPostCategoria(
    limite: number,
    pagina: number,
    idCategoria: string,
  ): Promise<{ data: IPost[]; totalCount: number }> {
    const maxLimite = Math.min(limite, 50);

    const [data, totalCount] = await this.repository.findAndCount({
      relations: ['categoria'],
      where: { categoria: { id: idCategoria } },
      skip: (pagina - 1) * maxLimite,
      take: maxLimite,
    });

    return { data, totalCount };
  }

  async findById(id: string): Promise<IPost | null> {
    return this.repository.findOne({
      relations: ['categoria'],
      where: { id },
    });
  }

  async search(
    query: string,
    includeInactive: boolean,
  ): Promise<{ data: IPost[]; totalCount: number }> {
    const qb = this.repository
      .createQueryBuilder('post')
      .where('post.titulo ILIKE :query', { query: `%${query}%` })
      .orWhere('post.descricao ILIKE :query', { query: `%${query}%` });

    if (!includeInactive) {
      qb.andWhere('post.ativo = :ativo', { ativo: true });
    }

    const [data, totalCount] = await qb.getManyAndCount();
    return { data, totalCount };
  }

  async create(post: IPost): Promise<IPost | null> {
    return await this.repository.save(post);
  }

  async update(post: IPost): Promise<IPost | null> {
    return await this.repository.save(post);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
