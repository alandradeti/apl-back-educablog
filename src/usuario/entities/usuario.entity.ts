import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUsuario } from './interfaces/usuario.interface';
import { Post } from '../../post/entities/post.entity';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';

@Entity({
  name: 'usuario',
})
export class Usuario implements IUsuario {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string | undefined;

  @Column({
    name: 'login',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  login: string;

  @Column({
    name: 'senha',
    type: 'varchar',
    nullable: false,
  })
  senha: string;

  @Column({
    name: 'tipo',
    type: 'varchar',
    default: 'aluno',
    nullable: false,
  })
  tipo: string;

  @OneToOne(() => Pessoa, (pessoa) => pessoa.usuario, {
    cascade: true,
  })
  pessoa?: Pessoa | undefined;

  @OneToMany(() => Post, (post) => post.usuarioCriacao)
  @JoinColumn({ name: 'id', referencedColumnName: 'id_usuario_criacao' })
  postsCriados?: Post[];

  @OneToMany(() => Post, (post) => post.usuarioCriacao)
  @JoinColumn({ name: 'id', referencedColumnName: 'id_usuario_atualizacao' })
  postsAtualizados?: Post[];
}
