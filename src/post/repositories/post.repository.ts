import { IPost } from '../entities/interfaces/post.interface';

export abstract class PostRepository {
  abstract findAll(limite: number, pagina: number): Promise<IPost[] | null>;
  abstract findAllActive(
    limite: number,
    pagina: number,
  ): Promise<IPost[] | null>;
  abstract findAllPostCategoria(
    limite: number,
    pagina: number,
    id: string,
  ): Promise<IPost[] | null>;
  abstract findById(id: string): Promise<IPost | null>;
  abstract search(query: string): Promise<IPost[] | null>;
  abstract create(post: IPost): Promise<IPost | null>;
  abstract update(post: IPost): Promise<IPost | null>;
  abstract delete(id: string): Promise<void>;
}
