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
}
