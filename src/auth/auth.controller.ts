import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  RefreshTokenRequestDto,
  SessionDto,
  SignInDto,
  SignOutDto,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signIn: SignInDto): Promise<SessionDto> {
    return this.authService.signIn(signIn.email, signIn.password);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshToken: RefreshTokenRequestDto,
  ): Promise<SessionDto> {
    return this.authService.refreshToken(refreshToken.refreshToken);
  }

  @Post('sign-out')
  async signOut(@Body() signOut: SignOutDto): Promise<void> {
    return this.authService.signOut(signOut.refreshToken, signOut.isAll);
  }

  @Post('change-password')
  async changePassword(
    @User('id') userId: string,
    @Body() changePassword: ChangePasswordDto,
  ): Promise<void> {
    await this.authService.changePassword(
      userId,
      changePassword.newPassword,
      changePassword.oldPassword,
    );
  }
}
