import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvModule, envValidate } from './env';
import { TodoModule } from './todo';
import { AuthModule } from './auth';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: envValidate, isGlobal: true }),
    EnvModule,
    TodoModule,
    AuthModule,
    UserModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
