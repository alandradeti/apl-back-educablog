import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  //UseGuards,
  //UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
//import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PessoaService } from '../services/pessoa.service';
//import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

const createPessoaSchema = z.object({
  cpf: z.string(),
  nome: z.string(),
  email: z.string().email(),
  dataNascimento: z.coerce.date(),
  telefone: z.string(),
});

const updatePessoaSchema = z.object({
  id: z.string().uuid(),
  cpf: z.string(),
  nome: z.string(),
  email: z.string().email(),
  dataNascimento: z.coerce.date(),
  telefone: z.string(),
});

type CreatePessoa = z.infer<typeof createPessoaSchema>;
type UpdatePessoa = z.infer<typeof updatePessoaSchema>;

@ApiTags('pessoa')
//@UseInterceptors(LoggingInterceptor)
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

  @ApiBearerAuth()
  //@UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPessoaSchema))
  @Post()
  async create(
    @Body()
    { cpf, nome, email, dataNascimento, telefone }: CreatePessoa,
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
  //@UseGuards(AuthGuard)
  @Put()
  async update(
    @Body(new ZodValidationPipe(updatePessoaSchema))
    { id, cpf, nome, email, dataNascimento, telefone }: UpdatePessoa,
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
  //@UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
