import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { hashPassword } from 'src/shared';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUser: CreateUserDto): Promise<UserDto> {
    const passwordHash = await hashPassword(createUser.password);
    const user = await this.prismaService.user.create({
      data: { ...createUser, password: passwordHash },
    });
    return new UserDto(user);
  }

  async updateUser(id: string, updateUser: UpdateUserDto): Promise<UserDto> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: { ...updateUser },
    });
    return new UserDto(user);
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    return new UserDto(user);
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<UserDto> {
    const passwordHash = await hashPassword(newPassword);
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
    return new UserDto(user);
  }
}
