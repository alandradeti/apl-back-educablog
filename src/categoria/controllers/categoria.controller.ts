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
import { CategoriaService } from '../services/categoria.service';

const categoriaSchema = z.object({
  nome: z.string(),
});

type BodyCategoria = z.infer<typeof categoriaSchema>;

@ApiTags('categoria')
@UseInterceptors(LoggingInterceptor)
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Get()
  async findAll(
    @Query('limite') limite: number = 10,
    @Query('pagina') pagina: number = 1,
  ) {
    return this.service.findAll(limite, pagina);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(categoriaSchema))
  @Post()
  @ApiBody({
    schema: {
      properties: {
        nome: { type: 'string' },
      },
    },
  })
  async create(@Body() { nome }: BodyCategoria) {
    return this.service.create({ nome });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiBody({
    schema: {
      properties: {
        nome: { type: 'string' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(categoriaSchema))
    body: Partial<BodyCategoria>,
  ) {
    const updateData: any = {};

    if (body.nome !== undefined) updateData.nome = body.nome;

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
