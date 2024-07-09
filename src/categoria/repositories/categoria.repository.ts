import { ICategoria } from '../entities/interfaces/categoria.interface';

export abstract class CategoriaRepository {
  abstract findAll(limite: number, pagina: number): Promise<ICategoria[]>;
  abstract findById(id: string): Promise<ICategoria | null>;
  abstract create(categoria: ICategoria): Promise<ICategoria | null>;
  abstract update(categoria: ICategoria): Promise<ICategoria | null>;
  abstract delete(id: string): Promise<void>;
}
