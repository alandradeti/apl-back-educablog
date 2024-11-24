import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  Request,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from '../services/usuario.service';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { Response } from 'express';

const usuarioSchema = z.object({
  login: z.string().optional().nullable(),
  senha: z.string().optional().nullable(),
  tipo: z.enum(['admin', 'professor', 'aluno']).default('aluno'),
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
  @Get()
  async findAll(
    @Query('limite') limite: number = 10,
    @Query('pagina') pagina: number = 1,
  ) {
    return this.service.findAll(limite, pagina);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('search')
  @ApiQuery({
    name: 'tipo',
    required: true,
    description: 'Tipo do usuário',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Nome para pesquisa (opcional)',
  })
  async search(
    @Request() req,
    @Res() res: Response,
    @Query('tipo') tipo: string,
    @Query('query') query?: string,
  ) {
    const { usuarios, totalCount } = await this.service.search(tipo, query);

    res.setHeader('x-total-count', totalCount);

    return res.json(usuarios);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const usuario = await this.service.findById(id);
    return usuario;
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
        tipo: {
          type: 'string',
          enum: ['admin', 'professor', 'aluno'],
          default: 'aluno',
        },
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
    { login, senha, tipo, pessoa }: BodyUsuario,
  ) {
    return this.service.create({
      login,
      senha,
      tipo,
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
        tipo: {
          type: 'string',
          enum: ['admin', 'professor', 'aluno'],
          default: 'aluno',
        },
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
    if (body.tipo !== undefined) updateData.tipo = body.tipo;

    if (body.pessoa !== undefined) {
      updateData.pessoa = {};
      if (body.pessoa.id !== undefined) updateData.pessoa.id = body.pessoa.id;
      if (body.pessoa.cpf !== undefined)
        updateData.pessoa.cpf = body.pessoa.cpf;
      if (body.pessoa.nome !== undefined)
        updateData.pessoa.nome = body.pessoa.nome;
      if (body.pessoa.email !== undefined)
        updateData.pessoa.email = body.pessoa.email;
      if (body.pessoa.dataNascimento !== undefined)
        updateData.pessoa.dataNascimento = body.pessoa.dataNascimento;
      if (body.pessoa.telefone !== undefined)
        updateData.pessoa.telefone = body.pessoa.telefone;
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
