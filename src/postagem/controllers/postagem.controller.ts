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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

const createPostagemSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  imagemUrl: z.string(),
  ativo: z.boolean().optional(),
  categoria: z
    .object({
      id: z.string().uuid().optional(),
      nome: z.string(),
    })
    .optional(),
});

const updatePostagemSchema = z.object({
  id: z.string().uuid(),
  titulo: z.string(),
  descricao: z.string(),
  imagemUrl: z.string(),
  ativo: z.boolean().optional(),
  categoria: z
    .object({
      id: z.string().uuid().optional(),
      nome: z.string(),
    })
    .optional(),
});

type CreatePostagem = z.infer<typeof createPostagemSchema>;
type UpdatePostagem = z.infer<typeof updatePostagemSchema>;

@ApiTags('postagem')
@UseInterceptors(LoggingInterceptor)
@Controller('postagem')
export class PostagemController {
  constructor(private readonly service: PostagemService) {}

  @Get()
  async findAll(
    @Query('limite') limite: number,
    @Query('pagina') pagina: number,
  ) {
    return this.service.findAll(limite, pagina);
  }

  @Get('postagem-categoria')
  async findAllCategoriaPostagem(
    @Query('limite') limite: number,
    @Query('pagina') pagina: number,
    @Query('idCategoria') idCategoria: string,
  ) {
    return this.service.findAllPostagemCategoria(limite, pagina, idCategoria);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPostagemSchema))
  @Post()
  @ApiBody({
    schema: {
      properties: {
        titulo: { type: 'string' },
        descricao: { type: 'string' },
        imagemUrl: { type: 'string' },
        ativo: { type: 'boolean', default: true },
        categoria: {
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
          },
        },
      },
    },
  })
  async create(
    @Body()
    { titulo, descricao, imagemUrl, ativo, categoria }: CreatePostagem,
  ) {
    return this.service.create({
      titulo,
      descricao,
      imagemUrl,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      ativo: ativo ?? true,
      categoria: categoria
        ? { id: categoria.id, nome: categoria.nome }
        : undefined,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  @ApiBody({
    schema: {
      properties: {
        id: { type: 'string' },
        titulo: { type: 'string' },
        descricao: { type: 'string' },
        imagemUrl: { type: 'string' },
        ativo: { type: 'boolean', default: true },
        categoria: {
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
          },
        },
      },
    },
  })
  async update(
    @Body(new ZodValidationPipe(updatePostagemSchema))
    { id, titulo, descricao, imagemUrl, ativo, categoria }: UpdatePostagem,
  ) {
    return this.service.update({
      id,
      titulo,
      descricao,
      imagemUrl,
      dataAtualizacao: new Date(),
      ativo,
      categoria: categoria
        ? { id: categoria.id, nome: categoria.nome }
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
