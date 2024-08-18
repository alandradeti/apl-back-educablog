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
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from '../services/usuario.service';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';

const usuarioSchema = z.object({
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

type BodyUsuario = z.infer<typeof usuarioSchema>;

@ApiTags('usuario')
@UseInterceptors(LoggingInterceptor)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  //@ApiBearerAuth()
  //@UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(usuarioSchema))
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
    { login, senha, pessoa }: BodyUsuario,
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
        : null,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiBody({
    schema: {
      properties: {
        login: { type: 'string', nullable: true },
        senha: { type: 'string', nullable: true },
        pessoa: {
          properties: {
            id: { type: 'string', format: 'uuid', nullable: true },
            cpf: { type: 'string', nullable: true },
            nome: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email', nullable: true },
            dataNascimento: { type: 'string', format: 'date', nullable: true },
            telefone: { type: 'string', nullable: true },
          },
          nullable: true,
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(usuarioSchema))
    body: Partial<BodyUsuario>,
  ) {
    const updateData: any = {};

    if (body.login !== undefined) updateData.login = body.login;
    if (body.senha !== undefined) updateData.senha = body.senha;

    if (body.pessoa !== undefined) {
      updateData.pessoa = {};
      if (body.pessoa.id !== undefined) updateData.pessoa.id = body.pessoa.id;
      if (body.pessoa.cpf !== undefined) updateData.pessoa.cpf = body.pessoa.cpf;
      if (body.pessoa.nome !== undefined) updateData.pessoa.nome = body.pessoa.nome;
      if (body.pessoa.email !== undefined) updateData.pessoa.email = body.pessoa.email;
      if (body.pessoa.dataNascimento !== undefined) updateData.pessoa.dataNascimento = body.pessoa.dataNascimento;
      if (body.pessoa.telefone !== undefined) updateData.pessoa.telefone = body.pessoa.telefone;
    }

    return this.service.update({
      id,
      ...updateData,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
