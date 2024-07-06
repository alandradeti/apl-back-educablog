import { ICategoria } from '../entities/interfaces/categoria.interface';

export abstract class CategoriaRepository {
  abstract findAll(limite: number, pagina: number): Promise<ICategoria[]>;
  abstract findById(id: number): Promise<ICategoria | null>;
  abstract create(categoria: ICategoria): Promise<void>;
  abstract update(categoria: ICategoria): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
