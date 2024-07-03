import { IPostagem } from 'src/postagem/entities/interfaces/postagem.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Postagem } from 'src/postagem/entities/postagem.entity';
import { Repository } from 'typeorm';
import { PostagemRepository } from '../postagem.repository';

export class PostagemPgRepository implements PostagemRepository {
  constructor(
    @InjectRepository(Postagem) private repository: Repository<Postagem>,
  ) {}

  async findAll(pagina: number, limite: number): Promise<IPostagem[]> {
    return this.repository.find({
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }

  async findById(id: string): Promise<IPostagem | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(postagem: IPostagem): Promise<void> {
    await this.repository.insert(postagem);
  }

  async update(postagem: IPostagem): Promise<void> {
    await this.repository.update({ id: postagem.id }, postagem);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}