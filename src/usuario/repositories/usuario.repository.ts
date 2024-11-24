import { IUsuario } from '../entities/interfaces/usuario.interface';

export abstract class UsuarioRepository {
  abstract findAll(
    limite: number,
    pagina: number,
  ): Promise<{ usuarios: IUsuario[]; totalCount: number }>;
  abstract search(
    tipo: string,
    query?: string,
  ): Promise<{ usuarios: IUsuario[]; totalCount: number }>;
  abstract findById(id: string): Promise<IUsuario | null>;
  abstract findByLogin(login: string): Promise<IUsuario | null>;
  abstract create(usuario: IUsuario): Promise<string | null>;
  abstract update(usuario: IUsuario): Promise<string> | null;
  abstract delete(id: string): Promise<void>;
}
