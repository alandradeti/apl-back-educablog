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
import { PostagemService } from '../services/postagem.service';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

const createPostagemSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
});

const updatePostagemSchema = z.object({
  id: z.string().uuid(),
  titulo: z.string(),
  descricao: z.string(),
});

type CreatePostagem = z.infer<typeof createPostagemSchema>;
type UpdatePostagem = z.infer<typeof updatePostagemSchema>;

@ApiTags('postagem')
@UseInterceptors(LoggingInterceptor)
@Controller('postagem')
export class PostagemController {
  constructor(private readonly postagemService: PostagemService) {}

  @Get()
  async findAll(
    @Query('limite') limite: number,
    @Query('pagina') pagina: number,
  ) {
    return this.postagemService.findAll(limite, pagina);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.postagemService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPostagemSchema))
  @Post()
  async create(@Body() { titulo, descricao }: CreatePostagem) {
    return this.postagemService.create({ titulo, descricao });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  async update(
    @Body(new ZodValidationPipe(updatePostagemSchema))
    { id, titulo, descricao }: UpdatePostagem,
  ) {
    return this.postagemService.update({ id, titulo, descricao });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postagemService.delete(id);
  }
}
