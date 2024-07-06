import { IPessoa } from '../entities/interfaces/pessoa.interface';

export abstract class PessoaRepository {
  abstract findAll(limite: number, pagina: number): Promise<IPessoa[]>;
  abstract findById(id: string): Promise<IPessoa | null>;
  abstract create(pessoa: IPessoa): Promise<void>;
  abstract update(pessoa: IPessoa): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
