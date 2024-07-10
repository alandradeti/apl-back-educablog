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
import { PostService } from '../services/post.service';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

const createPostSchema = z.object({
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

const updatePostSchema = z.object({
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

type CreatePost = z.infer<typeof createPostSchema>;
type UpdatePost = z.infer<typeof updatePostSchema>;

@ApiTags('posts')
@UseInterceptors(LoggingInterceptor)
@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get()
  async findAll(
    @Query('limite') limite: number = 10,
    @Query('pagina') pagina: number = 1,
  ) {
    return this.service.findAll(limite, pagina);
  }

  @Get('post-categoria')
  async findAllCategoriaPost(
    @Query('limite') limite: number,
    @Query('pagina') pagina: number,
    @Query('idCategoria') idCategoria: string,
  ) {
    return this.service.findAllPostCategoria(limite, pagina, idCategoria);
  }

  @Get('search')
  async search(@Query('query') query: string) {
    return this.service.search(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPostSchema))
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
    { titulo, descricao, imagemUrl, ativo, categoria }: CreatePost,
  ) {
    return this.service.create({
      titulo,
      descricao,
      imagemUrl,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      ativo: ativo ?? true,
      categoria: categoria ? { id: categoria.id, nome: categoria.nome } : null,
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
    @Body(new ZodValidationPipe(updatePostSchema))
    { id, titulo, descricao, imagemUrl, ativo, categoria }: UpdatePost,
  ) {
    return this.service.update({
      id,
      titulo,
      descricao,
      imagemUrl,
      dataAtualizacao: new Date(),
      ativo,
      categoria: categoria ? { id: categoria.id, nome: categoria.nome } : null,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
