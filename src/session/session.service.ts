import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { EnvService } from 'src/env';
import { PrismaService } from 'src/prisma';
import { JwtService } from '@nestjs/jwt';
import { ms } from 'src/shared';

@Injectable()
export class SessionService {
  private tokenExpiredIn: number;
  private refreshTokenExpiredIn: number;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly envService: EnvService,
    private readonly jwtService: JwtService,
  ) {
    this.tokenExpiredIn = ms(this.envService.get('JWT_EXPIRES_IN'));
    this.refreshTokenExpiredIn = ms(
      this.envService.get('REFRESH_TOKEMN_EXPIRES_IN'),
    );
  }

  async createSession(userId: string): Promise<Session> {
    const accessToken = await this.jwtService.signAsync({ sub: userId });
    const now = Date.now();
    const prepareCreate = {
      userId,
      accessToken,
      tokenExpiredAt: new Date(now + this.tokenExpiredIn),
      refreshTokenExpiredAt: new Date(now + this.refreshTokenExpiredIn),
    };
    return this.prismaService.session.create({
      data: prepareCreate,
    });
  }

  async updateSession(sessionId: string, userId: string): Promise<Session> {
    const token = await this.jwtService.signAsync({ sub: userId });
    return this.prismaService.session.update({
      where: {
        id: sessionId,
      },
      data: {
        userId,
        accessToken: token,
        tokenExpiredAt: new Date(Date.now() + this.tokenExpiredIn),
      },
    });
  }

  async getSessionByToken(accessToken: string): Promise<Session | null> {
    return this.prismaService.session.findFirst({
      where: {
        accessToken,
        refreshTokenExpiredAt: {
          gte: new Date(),
        },
      },
    });
  }

  async getSessionByRefreshToken(
    refreshToken: string,
  ): Promise<Session | null> {
    return this.prismaService.session.findFirst({
      where: {
        refreshToken,
        refreshTokenExpiredAt: {
          gte: new Date(),
        },
      },
    });
  }

  async deleteSessionByRefreshToken(refreshToken: string): Promise<void> {
    await this.prismaService.session.deleteMany({
      where: {
        refreshToken,
      },
    });
  }

  async deleteSessionByUserId(userId: string): Promise<void> {
    await this.prismaService.session.deleteMany({
      where: {
        userId,
      },
    });
  }
}
