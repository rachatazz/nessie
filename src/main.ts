import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { EnvService } from './env';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GLOBAL_PREFIX } from './shared';
import { v4 as uuid } from 'uuid';
import { fastifyHandleHooks } from './app.hook';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      requestIdHeader: 'x-request-id',
      genReqId: () => uuid(),
    }),
  );
  fastifyHandleHooks(app);

  const envService = app.get(EnvService);
  const reflector = app.get(Reflector);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      excludeExtraneousValues: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nessie API Docs')
    .setDescription('The Nessie API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${GLOBAL_PREFIX}/docs`, app, document);

  await app.listen(envService.get('PORT'));
}
bootstrap();
