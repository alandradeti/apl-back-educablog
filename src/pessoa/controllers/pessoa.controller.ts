import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { PessoaService } from '../services/pessoa.service';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

const createPessoaSchema = z.object({
  cpf: z.string(),
  nome: z.string(),
  email: z.string().email(),
  dataNascimento: z.coerce.date(),
  telefone: z.string(),
  usuario: z
    .object({
      id: z.string().uuid().optional(),
      login: z.string(),
      senha: z.string(),
    })
    .optional(),
});

const updatePessoaSchema = z.object({
  id: z.string().uuid(),
  cpf: z.string(),
  nome: z.string(),
  email: z.string().email(),
  dataNascimento: z.coerce.date(),
  telefone: z.string(),
  usuario: z
    .object({
      id: z.string().uuid().optional(),
      login: z.string(),
      senha: z.string(),
    })
    .optional(),
});

type CreatePessoa = z.infer<typeof createPessoaSchema>;
type UpdatePessoa = z.infer<typeof updatePessoaSchema>;

@ApiTags('pessoa')
@UseInterceptors(LoggingInterceptor)
@Controller('pessoa')
export class PessoaController {
  constructor(private readonly service: PessoaService) {}

  @Get()
  async findAll(
    @Query('limite') limite: number,
    @Query('pagina') pagina: number,
  ) {
    return this.service.findAll(limite, pagina);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  //@ApiBearerAuth()
  //@UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPessoaSchema))
  @Post()
  @ApiBody({
    schema: {
      properties: {
        cpf: { type: 'string' },
        nome: { type: 'string' },
        email: { type: 'string' },
        dataNascimento: { type: 'string', format: 'date' },
        telefone: { type: 'string' },
        usuario: {
          properties: {
            id: { type: 'string' },
            login: { type: 'string' },
            senha: { type: 'string' },
          },
          type: 'object',
        },
      },
    },
  })
  async create(
    @Body()
    { cpf, nome, email, dataNascimento, telefone, usuario }: CreatePessoa,
  ) {
    return this.service.create({
      cpf,
      nome,
      email,
      dataNascimento,
      telefone,
      usuario: {
        id: usuario?.id,
        login: usuario?.login,
        senha: usuario?.senha,
      },
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  @ApiBody({
    schema: {
      properties: {
        id: { type: 'string' },
        cpf: { type: 'string' },
        nome: { type: 'string' },
        email: { type: 'string' },
        dataNascimento: { type: 'string', format: 'date' },
        telefone: { type: 'string' },
        usuario: {
          properties: {
            id: { type: 'string' },
            login: { type: 'string' },
            senha: { type: 'string' },
          },
          type: 'object',
        },
      },
    },
  })
  async update(
    @Body(new ZodValidationPipe(updatePessoaSchema))
    { id, cpf, nome, email, dataNascimento, telefone, usuario }: UpdatePessoa,
  ) {
    return this.service.update({
      id,
      cpf,
      nome,
      email,
      dataNascimento,
      telefone,
      usuario: {
        id: usuario?.id,
        login: usuario.login,
        senha: usuario.senha,
      },
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
