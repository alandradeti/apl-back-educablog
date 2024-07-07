import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { UsuarioService } from '../services/usuario.service';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { ApiBody, ApiTags } from '@nestjs/swagger';

const sigInUsuarioSchema = z.object({
  login: z.string(),
  senha: z.string(),
});

type SigInUsuario = z.infer<typeof sigInUsuarioSchema>;

@ApiTags('sigin')
@UseInterceptors(LoggingInterceptor)
@Controller('sigin')
export class SigInController {
  constructor(private readonly service: UsuarioService) {}

  @Post()
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
    return this.service.signIn(login, senha);
  }
}
