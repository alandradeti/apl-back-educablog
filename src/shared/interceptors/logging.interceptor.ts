import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrometheusService } from '../services/prometheus.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly service: PrometheusService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log('Rota =>', request.route.path);
        console.log(`Tempo... ${Date.now() - now}ms`);

        const duracao = Date.now() - now;
        this.service.sendMetrics
          .labels(request.route.path)
          .observe(duracao / 1000);
      }),
    );
  }
  ß;
}
