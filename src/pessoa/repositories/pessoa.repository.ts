import { IPessoa } from '../entities/interfaces/pessoa.interface';

export abstract class PessoaRepository {
  abstract findAll(limite: number, pagina: number): Promise<IPessoa[] | null>;
  abstract findById(id: string): Promise<IPessoa | null>;
  abstract create(pessoa: IPessoa): Promise<IPessoa | null>;
  abstract update(pessoa: IPessoa): Promise<IPessoa | null>;
  abstract delete(id: string): Promise<void>;
}
