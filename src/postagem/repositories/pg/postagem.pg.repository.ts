import { IPostagem } from 'src/postagem/entities/interfaces/postagem.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Postagem } from 'src/postagem/entities/postagem.entity';
import { Repository } from 'typeorm';
import { PostagemRepository } from '../postagem.repository';

export class PostagemPgRepository implements PostagemRepository {
  constructor(
    @InjectRepository(Postagem) private repository: Repository<Postagem>,
  ) {}

  async findAll(limite: number, pagina: number): Promise<IPostagem[] | null> {
    const maxLimite = Math.min(limite, 50);

    return this.repository.find({
      relations: ['categoria'],
      skip: (pagina - 1) * maxLimite,
      take: limite,
    });
  }

  async findAllPostagemCategoria(
    pagina: number,
    limite: number,
    idCategoria: string,
  ): Promise<IPostagem[]> {
    return this.repository.find({
      relations: ['categoria'],
      where: { categoria: { id: idCategoria } },
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }

  async findById(id: string): Promise<IPostagem | null> {
    return await this.repository.findOne({
      relations: ['categoria'],
      where: { id },
    });
  }

  async create(postagem: IPostagem): Promise<IPostagem | null> {
    return await this.repository.save(postagem);
  }

  async update(postagem: IPostagem): Promise<IPostagem | null> {
    console.log(postagem);
    return await this.repository.save(postagem);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
