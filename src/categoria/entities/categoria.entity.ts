import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICategoria } from './interfaces/categoria.interface';
import { Postagem } from 'src/postagem/entities/postagem.entity';

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
  })
  nome: string;

  @OneToMany(() => Postagem, (postagem) => postagem.categoria)
  @JoinColumn({ name: 'id', referencedColumnName: 'id_categoria' })
  postagens?: Postagem[];
}
