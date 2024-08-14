import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from '../../entities/pessoa.entity';
import { PessoaRepository } from '../pessoa.repository';
import { IPessoa } from 'src/pessoa/entities/interfaces/pessoa.interface';

export class PessoaPgRepository implements PessoaRepository {
  constructor(
    @InjectRepository(Pessoa) private repository: Repository<Pessoa>,
  ) {}

  async findAll(limite: number, pagina: number): Promise<IPessoa[] | null> {
    const maxLimite = Math.min(limite, 50);

    return this.repository.find({
      skip: (pagina - 1) * maxLimite,
      take: limite,
    });
  }

  async findById(id: string): Promise<IPessoa | null> {
    return await this.repository.findOne({
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
