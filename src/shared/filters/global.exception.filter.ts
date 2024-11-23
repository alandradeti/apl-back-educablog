import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm'; // Caso esteja usando TypeORM para interação com o banco

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const httpArgumentsHost = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let responseBody: any = {};

    // Tratar erros do tipo HTTPException
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = (exception.getResponse() as any).message || 'Erro desconhecido';
      responseBody = this.createErrorResponse(httpStatus, message);
    }
    // Tratar erros de validação de dados (exemplo com class-validator)
    else if (
      exception instanceof Error &&
      exception.message.includes('validation failed')
    ) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = 'Erro de validação de dados';
      responseBody = this.createErrorResponse(httpStatus, message);
    }
    // Tratar erros de violação de chave única (TypeORM ou outros ORMs)
    else if (
      exception instanceof QueryFailedError &&
      exception.message.includes('duplicate key value')
    ) {
      httpStatus = HttpStatus.CONFLICT;
      message = 'Conflito de dados: chave duplicada';
      responseBody = this.createErrorResponse(httpStatus, message);
    }
    // Tratar erros de permissão ou acesso negado
    else if (
      exception instanceof Error &&
      exception.message.includes('forbidden')
    ) {
      httpStatus = HttpStatus.FORBIDDEN;
      message = 'Acesso negado';
      responseBody = this.createErrorResponse(httpStatus, message);
    }
    // Tratar erro 404 Not Found
    else if (
      exception instanceof Error &&
      exception.message.includes('not found')
    ) {
      httpStatus = HttpStatus.NOT_FOUND;
      message = 'Recurso não encontrado';
      responseBody = this.createErrorResponse(httpStatus, message);
    }
    // Caso contrário, tratar como erro genérico
    else {
      console.error('Exception:', exception); // Log de exceções desconhecidas
      message = 'Erro inesperado';
      responseBody = this.createErrorResponse(httpStatus, message);
    }

    httpAdapter.reply(
      httpArgumentsHost.getResponse(),
      responseBody,
      httpStatus,
    );
  }

  private createErrorResponse(statusCode: number, message: string) {
    return {
      statusCode,
      timestamp: new Date().toISOString(),
      message,
    };
  }
}
