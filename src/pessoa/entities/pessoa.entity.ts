import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IPessoa } from '../entities/interfaces/pessoa.interface';

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
}
