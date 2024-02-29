import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class Pagination {
  @Expose()
  @IsNumber()
  total: number;

  @Expose()
  @IsNumber()
  totalPage: number;

  @Expose()
  @IsNumber()
  page: number;

  @Expose()
  @IsNumber()
  perPage: number;

  constructor(partial?: Partial<Pagination>) {
    Object.assign(this, partial);
  }
}
