import { IUsuario } from '../entities/interfaces/usuario.interface';

export abstract class UsuarioRepository {
  abstract findById(id: string): Promise<IUsuario | null>;
  abstract findByLogin(login: string): Promise<IUsuario | null>;
  abstract create(usuario: IUsuario): Promise<void>;
  abstract update(usuario: IUsuario): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
