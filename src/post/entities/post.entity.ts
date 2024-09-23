import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Categoria } from '../../categoria/entities/categoria.entity';
import { ICategoria } from '../../categoria/entities/interfaces/categoria.interface';
import { IUsuario } from '../../usuario/entities/interfaces/usuario.interface';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { IPost } from './interfaces/post.interface';

@Entity({
  name: 'post',
})
export class Post implements IPost {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string | undefined;

  @Column({
    name: 'titulo',
    type: 'varchar',
    nullable: false,
  })
  titulo: string;

  @Column({
    name: 'descricao',
    type: 'text',
    nullable: false,
  })
  descricao: string;

  @Column({
    name: 'imagem_url',
    type: 'varchar',
    default: '',
    nullable: false,
  })
  imagemUrl: string;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  ativo?: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.postsCriados, {
    cascade: true,
  })
  @JoinColumn({
    name: 'id_usuario_criacao',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_usuario_criacao_id',
  })
  usuarioCriacao?: IUsuario;

  @Column({
    name: 'data_criacao',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  dataCriacao?: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.postsAtualizados, {
    cascade: true,
  })
  @JoinColumn({
    name: 'id_usuario_atualizacao',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_usuario_atualizacao_id',
  })
  usuarioAtualizacao: IUsuario;

  @Column({
    name: 'data_atualizacao',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  dataAtualizacao: Date;

  @ManyToOne(() => Categoria, (categoria) => categoria.posts, {
    cascade: true,
  })
  @JoinColumn({
    name: 'id_categoria',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_categoria_id',
  })
  categoria?: ICategoria | undefined;
}
