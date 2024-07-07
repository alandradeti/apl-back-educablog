import { Injectable } from '@nestjs/common';
import * as prometheus from 'prom-client';

@Injectable()
export class PrometheusService {
  private httRequestDurationMicroseconds: prometheus.Histogram<'route'>;

  constructor() {
    this.httRequestDurationMicroseconds = new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duração das solicitações HTTP em microssegundos',
      labelNames: ['route'],
      buckets: [0.1, 0.3, 1, 1.5, 2, 3, 5],
      registers: [prometheus.register],
    });
  }

  get sendMetrics() {
    return this.httRequestDurationMicroseconds;
  }
}
