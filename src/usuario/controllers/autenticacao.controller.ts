import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  Request,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';
import { UsuarioService } from '../services/usuario.service';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

const sigInUsuarioSchema = z.object({
  login: z.string(),
  senha: z.string(),
});

const TokenSchema = z.object({
  token: z.string(),
});

const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

type SigInUsuario = z.infer<typeof sigInUsuarioSchema>;
type Token = z.infer<typeof TokenSchema>;
type RefreshToken = z.infer<typeof RefreshTokenSchema>;

@ApiTags('autenticacao')
@UseInterceptors(LoggingInterceptor)
@Controller('autenticacao')
export class AutenticacaoController {
  constructor(
    private readonly service: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signin')
  @UsePipes(new ZodValidationPipe(sigInUsuarioSchema))
  @ApiBody({
    schema: {
      properties: {
        login: { type: 'string' },
        senha: { type: 'string' },
      },
    },
  })
  async signIn(@Body() { login, senha }: SigInUsuario) {
    const { token, refreshToken, tipo, tokenExpiration } =
      await this.service.signIn(login, senha);

    return { token, refreshToken, tipo, tokenExpiration };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      properties: {
        refreshToken: { type: 'string' },
      },
    },
  })
  async refreshAccessToken(@Body() { refreshToken }: RefreshToken) {
    console.log('RefreshToken recebido:', refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não fornecido');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const { accessToken } = await this.service.refreshAccessToken(payload);

      return { accessToken };
    } catch (error) {
      console.error('Erro ao tentar validar o refresh token:', error);
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('perfil')
  getPerfil(@Request() req) {
    return { id: req.usuario.id };
  }

  @Post('verify-token')
  @ApiBody({
    schema: {
      properties: {
        token: { type: 'string' },
      },
    },
  })
  async verifyToken(@Body() { token }: Token) {
    try {
      await this.jwtService.verifyAsync(token);
      return { valid: true };
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
