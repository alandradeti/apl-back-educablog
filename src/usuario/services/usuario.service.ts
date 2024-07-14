import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUsuario } from '../entities/interfaces/usuario.interface';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly repository: UsuarioRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(login: string, senha: string): Promise<{ token: string }> {
    const usuario = await this.repository.findByLogin(login);

    if (!usuario) throw new UnauthorizedException('Credenciais inválidas!');

    const senhaMatch = await compare(senha, usuario.senha);

    if (!senhaMatch) throw new UnauthorizedException('Credenciais inválidas!');

    const token = await this.jwtService.signAsync({
      id: usuario.id,
    });

    return { token };
  }

  async findById(id: string): Promise<IUsuario> {
    const usuario = await this.repository.findById(id);
    if (!usuario) throw new NotFoundException('Usuario não encontrado!');
    return usuario;
  }

  async create(usuario: IUsuario): Promise<void> {
    const senhaCriptografada = await hash(usuario.senha, 8);

    usuario.senha = senhaCriptografada;

    await this.repository.create(usuario);
  }

  async update(usuario: IUsuario): Promise<void> {
    const senhaCriptografada = await hash(usuario.senha, 8);

    usuario.senha = senhaCriptografada;

    await this.repository.update(usuario);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
