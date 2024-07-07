import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from 'src/pessoa/entities/pessoa.entity';
import { PessoaRepository } from '../pessoa.repository';
import { IPessoa } from 'src/pessoa/entities/interfaces/pessoa.interface';

export class PessoaPgRepository implements PessoaRepository {
  constructor(
    @InjectRepository(Pessoa) private repository: Repository<Pessoa>,
  ) {}

  async findAll(pagina: number, limite: number): Promise<IPessoa[] | null> {
    return this.repository.find({
      relations: ['usuario'],
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }

  async findById(id: string): Promise<IPessoa | null> {
    return await this.repository.findOne({
      relations: ['usuario'],
      where: { id },
    });
  }

  async create(pessoa: IPessoa): Promise<IPessoa | null> {
    return await this.repository.save(pessoa);
  }

  async update(pessoa: IPessoa): Promise<IPessoa | null> {
    return await this.repository.save(pessoa);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
