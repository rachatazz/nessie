import { Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';
import { omit } from 'lodash';
import { jsonParse } from './shared';

export function fastifyHandleHooks(
  app: NestFastifyApplication<RawServerDefault>,
): void {
  const fastify = app.getHttpAdapter().getInstance();
  let requestTimeStamp: number;

  fastify.addHook('preHandler', (request, reply, done) => {
    requestTimeStamp = Date.now();
    const log: Record<string, unknown> = {
      id: request.id,
      ip: request.ip,
      method: request.method,
      path: request.url,
      headers: omit(request.headers, ['authorization']),
    };
    const methodWithBody = ['POST', 'PUT', 'PATCH'];
    if (methodWithBody.includes(request.method)) {
      log['body'] = omit(request.body as Record<string, unknown>, [
        'refreshToken',
      ]);
    }
    Logger.log(JSON.stringify(log), 'IncomingRequest');
    done();
  });

  fastify.addHook('onSend', (request, reply, payload, done) => {
    reply.raw.setHeader('x-request-id', request.id);
    const responseTime = Date.now() - requestTimeStamp;
    const log = {
      id: request.id,
      status: reply.statusCode,
      body: jsonParse(payload),
      responseTime,
    };
    Logger.log(JSON.stringify(log), 'RequestCompleted');
    done(null, payload);
  });
}
