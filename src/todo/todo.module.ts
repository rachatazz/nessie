import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaModule } from 'src/prisma';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from 'src/env';
import { UserModule } from 'src/user';
import { SessionModule } from 'src/session';

@Module({
  imports: [PrismaModule, JwtModule, EnvModule, SessionModule, UserModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
