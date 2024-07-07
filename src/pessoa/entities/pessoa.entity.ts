import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPessoa } from '../entities/interfaces/pessoa.interface';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { IUsuario } from 'src/usuario/entities/interfaces/usuario.interface';

@Entity({
  name: 'pessoa',
})
export class Pessoa implements IPessoa {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string | undefined;

  @Column({
    name: 'cpf',
    type: 'varchar',
  })
  cpf: string;

  @Column({
    name: 'nome',
    type: 'varchar',
  })
  nome: string;

  @Column({
    name: 'email',
    type: 'varchar',
  })
  email: string;

  @Column({
    name: 'data_nascimento',
    type: 'date',
  })
  dataNascimento: Date;

  @Column({
    name: 'telefone',
    type: 'varchar',
  })
  telefone: string;

  @OneToOne(() => Usuario, {
    cascade: true,
  })
  @JoinColumn({
    name: 'id_usuario',
    referencedColumnName: 'id',
  })
  usuario?: IUsuario | undefined;
}
