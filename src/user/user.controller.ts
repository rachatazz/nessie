import { Body, Controller, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signUp(@Body() user: CreateUserDto): Promise<UserDto> {
    return this.userService.createUser(user);
  }

  @Patch()
  async updateUser(
    @User('id') userId: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(userId, updateUser);
  }
}
