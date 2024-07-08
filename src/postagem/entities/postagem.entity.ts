import { Categoria } from 'src/categoria/entities/categoria.entity';
import { IPostagem } from './interfaces/postagem.interface';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICategoria } from 'src/categoria/entities/interfaces/categoria.interface';

@Entity({
  name: 'postagem',
})
export class Postagem implements IPostagem {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string | undefined;

  @Column({
    name: 'titulo',
    type: 'varchar',
  })
  titulo: string;

  @Column({
    name: 'descricao',
    type: 'varchar',
  })
  descricao: string;

  @Column({
    name: 'imagem_url',
    type: 'varchar',
  })
  imagemUrl: string;

  @Column({
    name: 'data_criacao',
    type: 'timestamp without time zone',
  })
  dataCriacao: Date;

  @Column({
    name: 'data_atualizacao',
    type: 'timestamp without time zone',
  })
  dataAtualizacao: Date;

  @Column({
    name: 'ativo',
    type: 'boolean',
  })
  ativo?: boolean;

  @ManyToMany(() => Categoria, {
    cascade: true,
  })
  @JoinTable({
    name: 'postagem_categoria',
    joinColumn: {
      name: 'id_postagem',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_categoria',
      referencedColumnName: 'id',
    },
  })
  categorias?: ICategoria[] | undefined;
}
