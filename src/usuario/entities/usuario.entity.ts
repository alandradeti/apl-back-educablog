import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUsuario } from './interfaces/usuario.interface';
import { IPessoa } from 'src/pessoa/entities/interfaces/pessoa.interface';
import { Pessoa } from 'src/pessoa/entities/pessoa.entity';

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
  })
  login: string;

  @Column({
    name: 'senha',
    type: 'varchar',
  })
  senha: string;

  @OneToOne(() => Pessoa, {
    cascade: true,
  })
  @JoinColumn({
    name: 'id_pessoa',
    referencedColumnName: 'id',
  })
  pessoa?: IPessoa | undefined;
}
