import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class HealthDto {
  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsNumber()
  timestamp: number;

  constructor(partial?: Partial<HealthDto>) {
    Object.assign(this, partial);
  }
}
