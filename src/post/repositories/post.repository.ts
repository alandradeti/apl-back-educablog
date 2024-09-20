import { IPost } from '../entities/interfaces/post.interface';

export abstract class PostRepository {
  abstract findAll(
    limite: number,
    pagina: number,
  ): Promise<{ data: IPost[]; totalCount: number }>;
  abstract findAllActive(
    limite: number,
    pagina: number,
  ): Promise<{ data: IPost[]; totalCount: number }>;
  abstract findAllPostCategoria(
    limite: number,
    pagina: number,
    idCategoria: string,
  ): Promise<{ data: IPost[]; totalCount: number }>;
  abstract findById(id: string): Promise<IPost | null>;
  abstract search(
    query: string,
    includeInactive: boolean,
  ): Promise<{ data: IPost[]; totalCount: number }>;
  abstract create(post: IPost): Promise<IPost | null>;
  abstract update(post: IPost): Promise<IPost | null>;
  abstract delete(id: string): Promise<void>;
}
