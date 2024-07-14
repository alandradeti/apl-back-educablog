import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICategoria } from './interfaces/categoria.interface';
import { Post } from 'src/post/entities/post.entity';

@Entity({
  name: 'categoria',
})
export class Categoria implements ICategoria {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string | undefined;

  @Column({
    name: 'nome',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  nome: string;

  @OneToMany(() => Post, (post) => post.categoria)
  @JoinColumn({ name: 'id', referencedColumnName: 'id_categoria' })
  posts?: Post[];
}
