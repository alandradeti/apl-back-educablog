import { IPostagem } from '../entities/interfaces/postagem.interface';

export abstract class PostagemRepository {
  abstract findAll(limite: number, pagina: number): Promise<IPostagem[] | null>;
  abstract findById(id: string): Promise<IPostagem | null>;
  abstract create(postagem: IPostagem): Promise<IPostagem | null>;
  abstract update(postagem: IPostagem): Promise<IPostagem | null>;
  abstract delete(id: string): Promise<void>;
}
