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
  pessoa: z
    .object({
      id: z.string().uuid().optional(),
      cpf: z.string(),
      nome: z.string(),
      email: z.string().email(),
      dataNascimento: z.coerce.date(),
      telefone: z.string(),
    })
    .optional(),
});

const updateUsuarioSchema = z.object({
  id: z.string().uuid(),
  login: z.string(),
  senha: z.string(),
  pessoa: z
    .object({
      id: z.string().uuid(),
      cpf: z.string(),
      nome: z.string(),
      email: z.string().email(),
      dataNascimento: z.coerce.date(),
      telefone: z.string(),
    })
    .optional(),
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
        pessoa: {
          properties: {
            id: { type: 'string', format: 'uuid' },
            cpf: { type: 'string' },
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            dataNascimento: { type: 'string', format: 'date' },
            telefone: { type: 'string' },
          },
        },
      },
    },
  })
  async create(
    @Body()
    { login, senha, pessoa }: CreateUsuario,
  ) {
    return this.service.create({
      login,
      senha,
      pessoa: pessoa
        ? {
            id: pessoa.id,
            cpf: pessoa.cpf,
            nome: pessoa.nome,
            email: pessoa.email,
            dataNascimento: pessoa.dataNascimento,
            telefone: pessoa.telefone,
          }
        : undefined,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  @ApiBody({
    schema: {
      properties: {
        id: { type: 'string', format: 'uuid' },
        login: { type: 'string' },
        senha: { type: 'string' },
        pessoa: {
          properties: {
            id: { type: 'string', format: 'uuid' },
            cpf: { type: 'string' },
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            dataNascimento: { type: 'string', format: 'date' },
            telefone: { type: 'string' },
          },
        },
      },
    },
  })
  async update(
    @Body(new ZodValidationPipe(updateUsuarioSchema))
    { id, login, senha, pessoa }: UpdateUsuario,
  ) {
    return this.service.update({
      id,
      login,
      senha,
      pessoa: pessoa
        ? {
            id: pessoa.id,
            cpf: pessoa.cpf,
            nome: pessoa.nome,
            email: pessoa.email,
            dataNascimento: pessoa.dataNascimento,
            telefone: pessoa.telefone,
          }
        : undefined,
    });
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
