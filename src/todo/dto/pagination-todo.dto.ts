import { Expose, Type } from 'class-transformer';
import { Pagination } from 'src/shared';
import { TodoDto } from './todo.dto';

export class TodoResponseDto extends Pagination {
  @Expose()
  @Type(() => TodoDto)
  items: TodoDto[];

  constructor(partial?: Partial<TodoResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
