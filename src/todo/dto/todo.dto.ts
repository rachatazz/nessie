import { Expose } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class TodoDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string | null;

  @Expose()
  @IsBoolean()
  completed: boolean;

  @Expose()
  @IsDateString()
  createdAt: Date;

  constructor(partial?: Partial<TodoDto>) {
    Object.assign(this, partial);
  }
}
