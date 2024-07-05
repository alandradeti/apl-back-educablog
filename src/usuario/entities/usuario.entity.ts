import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUsuario } from './interfaces/usuario.interface';

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
}
