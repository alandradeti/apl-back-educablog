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
  categorias: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        nome: z.string(),
      }),
    )
    .optional(),
});

const updatePostagemSchema = z.object({
  id: z.string().uuid(),
  titulo: z.string(),
  descricao: z.string(),
  imagemUrl: z.string(),
  ativo: z.boolean().optional(),
  categorias: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        nome: z.string(),
      }),
    )
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
        categorias: {
          type: 'array',
          items: {
            properties: {
              id: { type: 'number' },
              nome: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async create(
    @Body()
    { titulo, descricao, imagemUrl, ativo, categorias }: CreatePostagem,
  ) {
    return this.service.create({
      titulo,
      descricao,
      imagemUrl,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      ativo: ativo ?? true,
      categorias: categorias?.map(({ id, nome }) => ({ id, nome })),
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
        categorias: {
          type: 'array',
          items: {
            properties: {
              id: { type: 'number' },
              nome: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async update(
    @Body(new ZodValidationPipe(updatePostagemSchema))
    { id, titulo, descricao, imagemUrl, ativo, categorias }: UpdatePostagem,
  ) {
    return this.service.update({
      id,
      titulo,
      descricao,
      imagemUrl,
      dataAtualizacao: new Date(),
      ativo,
      categorias: categorias?.map(({ id, nome }) => ({ id, nome })),
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
