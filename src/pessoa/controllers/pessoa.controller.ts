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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';

import { AuthGuard } from '../../shared/guards/auth.guard';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';
import { PessoaService } from '../services/pessoa.service';

const pessoaSchema = z.object({
  cpf: z.string(),
  nome: z.string(),
  email: z.string().email(),
  dataNascimento: z.coerce.date(),
  telefone: z.string(),
});

type BodyPessoa = z.infer<typeof pessoaSchema>;

@ApiTags('pessoa')
@UseInterceptors(LoggingInterceptor)
@Controller('pessoa')
export class PessoaController {
  constructor(private readonly service: PessoaService) {}

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
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(pessoaSchema))
  @Post()
  @ApiBody({
    schema: {
      properties: {
        cpf: { type: 'string' },
        nome: { type: 'string' },
        email: { type: 'string', format: 'email' },
        dataNascimento: { type: 'string', format: 'date' },
        telefone: { type: 'string' },
      },
    },
  })
  async create(
    @Body()
    { cpf, nome, email, dataNascimento, telefone }: BodyPessoa,
  ) {
    return this.service.create({
      cpf,
      nome,
      email,
      dataNascimento,
      telefone,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiBody({
    schema: {
      properties: {
        cpf: { type: 'string', format: 'cpf' },
        nome: { type: 'string' },
        email: { type: 'string', format: 'email' },
        dataNascimento: { type: 'string', format: 'date' },
        telefone: { type: 'string', format: 'phone' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(pessoaSchema))
    { cpf, nome, email, dataNascimento, telefone }: BodyPessoa,
  ) {
    return this.service.update({
      id,
      cpf,
      nome,
      email,
      dataNascimento,
      telefone,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
