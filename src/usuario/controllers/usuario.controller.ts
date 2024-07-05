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
//import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { UsuarioService } from '../services/usuario.service';

const createUsuarioSchema = z.object({
  login: z.string(),
  senha: z.string(),
  nome: z.string(),
  email: z.string().email(),
  dataNascimento: z.coerce.date(),
  telefone: z.string(),
});

const updateUsuarioSchema = z.object({
  id: z.string().uuid(),
  login: z.string(),
  senha: z.string(),
  nome: z.string(),
  email: z.string().email(),
  dataNascimento: z.coerce.date(),
  telefone: z.string(),
});

type CreateUsuario = z.infer<typeof createUsuarioSchema>;
type UpdateUsuario = z.infer<typeof updateUsuarioSchema>;

@ApiTags('usuario')
//@UseInterceptors(LoggingInterceptor)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

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
  @UsePipes(new ZodValidationPipe(createUsuarioSchema))
  @Post()
  async create(
    @Body()
    { login, senha, nome, email, dataNascimento, telefone }: CreateUsuario,
  ) {
    return this.service.create({
      login,
      senha,
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
    @Body(new ZodValidationPipe(updateUsuarioSchema))
    { id, login, senha, nome, email, dataNascimento, telefone }: UpdateUsuario,
  ) {
    return this.service.update({
      id,
      login,
      senha,
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
