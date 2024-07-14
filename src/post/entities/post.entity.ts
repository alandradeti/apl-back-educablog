import { Categoria } from 'src/categoria/entities/categoria.entity';
import { IPost } from './interfaces/post.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICategoria } from 'src/categoria/entities/interfaces/categoria.interface';

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
    type: 'varchar',
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
    name: 'data_criacao',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  dataCriacao: Date;

  @Column({
    name: 'data_atualizacao',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  dataAtualizacao: Date;

  @Column({
    name: 'ativo',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  ativo?: boolean;

  @ManyToOne(() => Categoria, (categoria) => categoria.posts, {
    cascade: true,
  })
  @JoinColumn({
    name: 'id_categoria',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_categoria_id',
  })
  @Column({
    name: 'id_categoria',
    type: 'uuid',
    nullable: true,
  })
  categoria?: ICategoria | undefined;
}
