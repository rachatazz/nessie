import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto, UserService } from 'src/user';
import { SessionDto } from './dto';
import { SessionService } from 'src/session';
import { comparePassword } from 'src/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async signIn(email: string, password: string): Promise<SessionDto> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException();

    const compare = await comparePassword(password, user.password);
    if (!compare) throw new UnauthorizedException();

    const session = await this.sessionService.createSession(user.id);
    return new SessionDto(session);
  }

  async refreshToken(refreshToken: string): Promise<SessionDto> {
    const session =
      await this.sessionService.getSessionByRefreshToken(refreshToken);
    if (!session) throw new UnauthorizedException();
    const newSession = await this.sessionService.updateSession(
      session.id,
      session.userId,
    );
    return new SessionDto(newSession);
  }

  async signOut(refreshToken: string, isAll: boolean = false): Promise<void> {
    const session =
      await this.sessionService.getSessionByRefreshToken(refreshToken);
    if (!session) return;
    return isAll
      ? this.sessionService.deleteSessionByUserId(session.userId)
      : this.sessionService.deleteSessionByRefreshToken(refreshToken);
  }

  async changePassword(
    userId: string,
    newPassword: string,
    oldPassword: string,
  ): Promise<UserDto> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UnauthorizedException();

    const compare = await comparePassword(oldPassword, user.password);
    if (!compare) throw new UnauthorizedException();

    return this.userService.updateUserPassword(userId, newPassword);
  }
}
