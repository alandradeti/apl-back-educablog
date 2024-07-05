import { IPostagem } from './interfaces/postagem.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'postagem',
})
export class Postagem implements IPostagem {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id?: string | undefined;

  @Column({
    name: 'titulo',
    type: 'varchar',
  })
  titulo: string;

  @Column({
    name: 'descricao',
    type: 'varchar',
  })
  descricao: string;

  @Column({
    name: 'imagem_url',
    type: 'varchar',
  })
  imagem_url: string;
}
