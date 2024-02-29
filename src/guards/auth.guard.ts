import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { EnvService } from 'src/env';
import { SessionService } from 'src/session';
import { UserService } from 'src/user';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;
  private authenType: 'STATEFUL' | 'STATELESS';

  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {
    this.jwtSecret = this.envService.get('JWT_SECRET');
    this.authenType = this.envService.get('AUTHEN_TYPE');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      if (this.authenType === 'STATELESS') {
        request['user'] = { id: payload.sub };
      } else {
        const session = await this.sessionService.getSessionByToken(token);
        if (!session) throw new NotFoundException();
        request['user'] = await this.userService.getUserById(payload.sub);
      }
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
