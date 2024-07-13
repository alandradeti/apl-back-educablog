import { ICategoria } from 'src/categoria/entities/interfaces/categoria.interface';

export interface IPost {
  id?: string;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  dataCriacao?: Date;
  dataAtualizacao: Date;
  ativo?: boolean;
  categoria?: ICategoria;
}
