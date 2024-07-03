import { IPostagem } from '../entities/interfaces/postagem.interface';

export abstract class PostagemRepository {
  abstract findAll(limite: number, pagina: number): Promise<IPostagem[]>;
  abstract findById(id: string): Promise<IPostagem | null>;
  abstract create(postagem: IPostagem): Promise<void>;
  abstract update(postagem: IPostagem): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
