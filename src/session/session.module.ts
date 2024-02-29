import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { PrismaModule } from 'src/prisma';
import { EnvModule, EnvService } from 'src/env';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      useFactory: (envService: EnvService) => ({
        secret: envService.get('JWT_SECRET'),
        signOptions: { expiresIn: envService.get('JWT_EXPIRES_IN') },
        global: true,
      }),
      inject: [EnvService],
    }),
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
