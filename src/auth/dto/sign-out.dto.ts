import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SignOutDto {
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsBoolean()
  isAll?: boolean;
}
