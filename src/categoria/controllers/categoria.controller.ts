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
import { CategoriaService } from '../services/categoria.service';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

const createCategoriaSchema = z.object({
  nome: z.string(),
});

const updateCategoriaSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string(),
});

type CreateCategoria = z.infer<typeof createCategoriaSchema>;
type UpdateCategoria = z.infer<typeof updateCategoriaSchema>;

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
  @UsePipes(new ZodValidationPipe(createCategoriaSchema))
  @Post()
  @ApiBody({
    schema: {
      properties: {
        nome: { type: 'string' },
      },
    },
  })
  async create(@Body() { nome }: CreateCategoria) {
    return this.service.create({ nome });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  @ApiBody({
    schema: {
      properties: {
        id: { type: 'string', format: 'uuid' },
        nome: { type: 'string' },
      },
    },
  })
  async update(
    @Body(new ZodValidationPipe(updateCategoriaSchema))
    { id, nome }: UpdateCategoria,
  ) {
    return this.service.update({ id, nome });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
