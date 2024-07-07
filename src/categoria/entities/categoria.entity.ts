import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ICategoria } from './interfaces/categoria.interface';

@Entity({
  name: 'categoria',
})
export class Categoria implements ICategoria {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: number | undefined;

  @Column({
    name: 'nome',
    type: 'varchar',
  })
  nome: string;
}
