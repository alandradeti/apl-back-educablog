import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IUsuario } from './interfaces/usuario.interface';
import { IPessoa } from 'src/pessoa/entities/interfaces/pessoa.interface';
import { Pessoa } from 'src/pessoa/entities/pessoa.entity';
import { Post } from 'src/post/entities/post.entity';

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

  @OneToOne(() => Pessoa, {
    cascade: true,
  })
  @JoinColumn({
    name: 'id_pessoa',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_pessoa_id',
  })
  @Column({
    name: 'id_pessoa',
    type: 'uuid',
    nullable: true,
    unique: true,
  })
  @Unique('uq_pessoa_id', ['id_pessoa'])
  pessoa?: IPessoa | undefined;

  @OneToMany(() => Post, (post) => post.usuarioCriacao)
  @JoinColumn({ name: 'id', referencedColumnName: 'id_usuario_criacao' })
  postsCriados?: Post[];

  @OneToMany(() => Post, (post) => post.usuarioCriacao)
  @JoinColumn({ name: 'id', referencedColumnName: 'id_usuario_atualizacao' })
  postsAtualizados?: Post[];
}
