import { IPost } from 'src/post/entities/interfaces/post.interface';

export interface ICategoria {
  id?: string;
  nome: string;
  postagens?: IPost[];
}
