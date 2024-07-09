import { IPessoa } from 'src/pessoa/entities/interfaces/pessoa.interface';

export interface IUsuario {
  id?: string;
  login: string;
  senha: string;
  pessoa?: IPessoa;
}
