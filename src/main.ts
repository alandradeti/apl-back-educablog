import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupRedoc } from './shared/middlewares/redoc.middleware';
import { GlobalExceptionFilter } from './shared/filters/global.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do filtro de exceção global
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Educablog-API')
    .setDescription('Educablog API - Gestão de postagens escolares')
    .setVersion('1.0')
    .addTag('educablog')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Inicialização do Swagger (Documentação/Requisição) da API
  setupRedoc(app); // Documentação detalhada da API

  // Configuração do CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  await app.listen(Number(process.env.PORT_APP) || 3010);
}
bootstrap();
