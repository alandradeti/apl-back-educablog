import { IUsuario } from 'src/usuario/entities/interfaces/usuario.interface';

export interface IPessoa {
  id?: string;
  cpf: string;
  nome: string;
  email: string;
  dataNascimento: Date;
  telefone: string;
  usuario?: IUsuario;
}
