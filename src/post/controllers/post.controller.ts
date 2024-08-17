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
  Request,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipe/zod-validation.pipe';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';

const postSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  imagemUrl: z.string(),
  ativo: z.boolean().optional(),
  categoria: z
    .object({
      id: z.string().uuid().optional(),
      nome: z.string(),
    })
    .optional()
    .nullable(),
});

type BodyPost = z.infer<typeof postSchema>;

@ApiTags('posts')
@UseInterceptors(LoggingInterceptor)
@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get()
  async findAllActive(
    @Query('limite') limite: number = 10,
    @Query('pagina') pagina: number = 1,
  ) {
    return this.service.findAllActive(limite, pagina);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('admin')
  async findAll(
    @Query('limite') limite: number = 10,
    @Query('pagina') pagina: number = 1,
  ) {
    return this.service.findAll(limite, pagina);
  }

  @Get('post-categoria')
  async findAllCategoriaPost(
    @Query('limite') limite: number = 10,
    @Query('pagina') pagina: number = 1,
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
  @UsePipes(new ZodValidationPipe(postSchema))
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
    @Request() req,
    @Body()
    { titulo, descricao, imagemUrl, ativo, categoria }: BodyPost,
  ) {
    return this.service.create({
      titulo,
      descricao,
      imagemUrl,
      ativo: ativo ?? true,
      usuarioCriacao: req.usuario.id,
      dataCriacao: new Date(),
      usuarioAtualizacao: req.usuario.id,
      dataAtualizacao: new Date(),
      categoria: categoria ? { id: categoria.id, nome: categoria.nome } : null,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
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
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(postSchema))
    { titulo, descricao, imagemUrl, ativo, categoria }: BodyPost,
  ) {
    return this.service.update({
      id,
      titulo,
      descricao,
      imagemUrl,
      ativo,
      usuarioAtualizacao: req.usuario.id,
      dataAtualizacao: new Date(),
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
