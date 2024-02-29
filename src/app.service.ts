import { Injectable } from '@nestjs/common';
import { HealthDto } from './shared';

@Injectable()
export class AppService {
  healthCheck(): HealthDto {
    return new HealthDto({ status: 'ok', timestamp: Date.now() });
  }
}
