import { Expose } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';

export class SessionDto {
  @Expose()
  @IsString()
  accessToken: string;

  @Expose()
  @IsString()
  refreshToken: string;

  @Expose()
  @IsDateString()
  tokenExpiredAt: Date;

  @Expose()
  @IsDateString()
  refreshTokenExpiredAt: Date;

  constructor(partial?: Partial<SessionDto>) {
    Object.assign(this, partial);
  }
}
