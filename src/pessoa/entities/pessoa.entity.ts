import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPessoa } from '../entities/interfaces/pessoa.interface';
import { Usuario } from 'src/usuario/entities/usuario.entity';

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
    nullable: false,
    unique: true,
  })
  cpf: string;

  @Column({
    name: 'nome',
    type: 'varchar',
    nullable: false,
  })
  nome: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'data_nascimento',
    type: 'date',
    nullable: false,
  })
  dataNascimento: Date;

  @Column({
    name: 'telefone',
    type: 'varchar',
    nullable: false,
  })
  telefone: string;

  @OneToOne(() => Usuario, (user) => user.pessoa, {
    // eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'id_usuario',
    foreignKeyConstraintName: 'fk_usuario_id',
  })
  usuario?: Usuario | undefined;
}
