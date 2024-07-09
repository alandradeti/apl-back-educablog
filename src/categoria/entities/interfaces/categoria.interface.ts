import { IPostagem } from 'src/postagem/entities/interfaces/postagem.interface';

export interface ICategoria {
  id?: string;
  nome: string;
  postagens?: IPostagem[];
}
