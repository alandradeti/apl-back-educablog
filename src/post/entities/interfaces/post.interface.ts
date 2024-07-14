import { ICategoria } from 'src/categoria/entities/interfaces/categoria.interface';
import { IUsuario } from 'src/usuario/entities/interfaces/usuario.interface';

export interface IPost {
  id?: string;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  ativo?: boolean;
  usuarioCriacao?: IUsuario;
  dataCriacao?: Date;
  usuarioAtualizacao: IUsuario;
  dataAtualizacao: Date;
  categoria?: ICategoria;
}
