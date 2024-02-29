import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  QueryTodoDto,
  TodoResponseDto,
  CreateTodoDto,
  TodoDto,
  UpdateTodoDto,
} from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards';
import { User } from 'src/decorators';

@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAllTodos(
    @User('id') userId: string,
    @Query() query: QueryTodoDto,
  ): Promise<TodoResponseDto> {
    return this.todoService.getAllTodos(userId, query);
  }

  @Get(':id')
  getTodoById(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<TodoDto> {
    return this.todoService.getTodoById(userId, id);
  }

  @Post()
  async createTodo(
    @User('id') userId: string,
    @Body() todoRequest: CreateTodoDto,
  ): Promise<TodoDto> {
    return this.todoService.createTodo(userId, todoRequest);
  }

  @Patch(':id')
  updateTodo(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() todo: UpdateTodoDto,
  ): Promise<TodoDto> {
    return this.todoService.updateTodo(userId, id, todo);
  }

  @Delete(':id')
  deleteTodo(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.todoService.deleteTodo(userId, id);
  }
}
