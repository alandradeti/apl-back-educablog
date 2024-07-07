import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from '../services/usuario.service';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

const createUsuarioSchema = z.object({
  login: z.string(),
  senha: z.string(),
});

const updateUsuarioSchema = z.object({
  id: z.string().uuid(),
  login: z.string(),
  senha: z.string(),
});

type CreateUsuario = z.infer<typeof createUsuarioSchema>;
type UpdateUsuario = z.infer<typeof updateUsuarioSchema>;

@ApiTags('usuario')
@UseInterceptors(LoggingInterceptor)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  //@ApiBearerAuth()
  //@UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createUsuarioSchema))
  @Post()
  @ApiBody({
    schema: {
      properties: {
        login: { type: 'string' },
        senha: { type: 'string' },
      },
    },
  })
  async create(
    @Body()
    { login, senha }: CreateUsuario,
  ) {
    return this.service.create({
      login,
      senha,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  @ApiBody({
    schema: {
      properties: {
        id: { type: 'string' },
        login: { type: 'string' },
        senha: { type: 'string' },
      },
    },
  })
  async update(
    @Body(new ZodValidationPipe(updateUsuarioSchema))
    { id, login, senha }: UpdateUsuario,
  ) {
    return this.service.update({
      id,
      login,
      senha,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
