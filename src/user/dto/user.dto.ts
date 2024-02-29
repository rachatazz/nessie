import { Expose } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsString } from 'class-validator';

export class UserDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  displayName: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsEnum(['ADMIN', 'USER'])
  role: 'ADMIN' | 'USER';

  password: string;

  @Expose()
  @IsDateString()
  createdAt: Date;

  @Expose()
  @IsDateString()
  updatedAt: Date;

  constructor(partial?: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
