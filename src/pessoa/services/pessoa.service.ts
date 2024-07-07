import { Injectable, NotFoundException } from '@nestjs/common';
import { PessoaRepository } from '../repositories/pessoa.repository';
import { IPessoa } from '../entities/interfaces/pessoa.interface';
import { hash } from 'bcryptjs';

@Injectable()
export class PessoaService {
  constructor(private readonly repository: PessoaRepository) {}

  async findAll(limit: number, page: number): Promise<IPessoa[]> {
    return this.repository.findAll(limit, page);
  }

  async findById(id: string): Promise<IPessoa> {
    const pessoa = await this.repository.findById(id);
    if (!pessoa) throw new NotFoundException('Pessoa não encontrada!');
    return pessoa;
  }

  async create(pessoa: IPessoa): Promise<IPessoa> {
    const senhaCriptografada = await hash(pessoa.usuario.senha, 8);

    console.log(senhaCriptografada);

    pessoa.usuario = { login: pessoa.usuario.login, senha: senhaCriptografada };

    console.log(pessoa);

    return await this.repository.create(pessoa);
  }

  async update(pessoa: IPessoa): Promise<IPessoa> {
    const senhaCriptografada = await hash(pessoa.usuario.senha, 8);

    pessoa.usuario = { login: pessoa.usuario.login, senha: senhaCriptografada };

    return await this.repository.update(pessoa);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
