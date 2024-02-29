import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthDto } from './shared';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  healthCheck(): HealthDto {
    return this.appService.healthCheck();
  }
}
