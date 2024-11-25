import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { compare, hash } from 'bcryptjs';
import { IUsuario } from '../entities/interfaces/usuario.interface';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly repository: UsuarioRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    login: string,
    senha: string,
  ): Promise<{
    token: string;
    refreshToken: string;
    tipo: string;
    tokenExpiration: number;
  }> {
    const usuario = await this.repository.findByLogin(login);

    if (!usuario) throw new UnauthorizedException('Credenciais inválidas!');

    const senhaMatch = await compare(senha, usuario.senha);

    if (!senhaMatch) throw new UnauthorizedException('Credenciais inválidas!');

    // Gerar access token
    const token = await this.jwtService.signAsync(
      { id: usuario.id },
      {
        expiresIn: parseInt(
          process.env.TOKEN_EXPIRATION_TIME || '60000',
          10,
        ),
      },
    );

    // Gerar refresh token
    const refreshToken = await this.jwtService.signAsync(
      { id: usuario.id },
      {
        expiresIn: parseInt(
          process.env.TOKEN_EXPIRATION_TIME || '60000',
          10,
        ),
      },
    );

    return {
      token,
      refreshToken,
      tipo: usuario.tipo,
      tokenExpiration: parseInt(
        process.env.TOKEN_EXPIRATION_TIME || '60000',
        10,
      ),
    };
  }

  // Método para renovar o access token com o refresh token
  async refreshAccessToken(payload: any): Promise<{ accessToken: string }> {
    try {
      // Gerar um novo access token com o payload do refreshToken
      const accessToken = await this.jwtService.signAsync(
        { id: payload.id },
        {
          expiresIn: parseInt(
            process.env.TOKEN_EXPIRATION_TIME || '60000',
            10,
          ),
        },
      );

      console.log('Refresh token válido. Novo access token gerado.');

      return { accessToken };
    } catch (error) {
      console.error('Erro ao gerar novo access token:', error);
      throw new UnauthorizedException('Falha ao gerar novo token');
    }
  }

  async findAll(
    limit: number,
    page: number,
  ): Promise<{ usuarios: IUsuario[]; totalCount: number }> {
    return this.repository.findAll(limit, page);
  }

  async search(
    tipo: string,
    query?: string,
  ): Promise<{ usuarios: IUsuario[]; totalCount: number }> {
    const { usuarios, totalCount } = await this.repository.search(tipo, query);

    if (!usuarios || usuarios.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado para a busca!');
    }

    return { usuarios, totalCount };
  }

  async findById(id: string): Promise<IUsuario> {
    const usuario = await this.repository.findById(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado!');
    return usuario;
  }

  async create(usuario: IUsuario): Promise<string> {
    const senhaCriptografada = await hash(usuario.senha, 8);

    usuario.senha = senhaCriptografada;

    return await this.repository.create(usuario);
  }

  async update(usuario: IUsuario): Promise<void> {
    if (usuario.senha !== undefined) {
      const senhaCriptografada = await hash(usuario.senha, 8);

      usuario.senha = senhaCriptografada;
    }

    await this.repository.update(usuario);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
