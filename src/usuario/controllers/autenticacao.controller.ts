import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  Request,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';
import { UsuarioService } from '../services/usuario.service';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../shared/guards/auth.guard';

const sigInUsuarioSchema = z.object({
  login: z.string(),
  senha: z.string(),
});

type SigInUsuario = z.infer<typeof sigInUsuarioSchema>;

@ApiTags('autenticacao')
@UseInterceptors(LoggingInterceptor)
@Controller('autenticacao')
export class AutenticacaoController {
  constructor(private readonly service: UsuarioService) {}

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
  async signIn(
    @Body()
    { login, senha }: SigInUsuario,
  ) {
    return await this.service.signIn(login, senha);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('perfil')
  getPerfil(@Request() req) {
    return { id: req.usuario.id };
  }
}
