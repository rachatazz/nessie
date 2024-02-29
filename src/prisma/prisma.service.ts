import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EnvService } from 'src/env';
import { hashPassword } from 'src/shared';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private adminEmail: string;
  private adminPassword: string;

  constructor(private readonly envService: EnvService) {
    super();
    this.adminEmail = this.envService.get('ADMIN_EMAIL');
    this.adminPassword = this.envService.get('ADMIN_PASSWORD');
  }

  async onModuleInit() {
    await this.$connect();
    await this.initUserAdmin();
  }

  async initUserAdmin() {
    const password = await hashPassword(this.adminPassword);
    await this.user.upsert({
      where: { email: this.adminEmail },
      create: {
        email: this.adminEmail,
        password,
        displayName: 'Admin',
        role: 'ADMIN',
      },
      update: {},
    });
  }
}
