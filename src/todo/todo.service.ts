import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import {
  QueryTodoDto,
  TodoResponseDto,
  CreateTodoDto,
  TodoDto,
  UpdateTodoDto,
} from './dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getAllTodos(
    userId: string,
    query?: QueryTodoDto,
  ): Promise<TodoResponseDto> {
    const where: Prisma.TodoWhereInput = { userId };
    if (query?.keyword) {
      where.OR = [
        { title: { contains: query?.keyword } },
        { description: { contains: query?.keyword } },
      ];
    }

    const sortBy = query?.sortBy ?? 'createdAt';
    const orderBy = query?.orderBy ?? 'asc';
    const page = query?.page ?? 1;
    const perPage = query?.perPage ?? 10;

    const totalPm = this.prisma.todo.count({ where });
    const todosPm = this.prisma.todo.findMany({
      where,
      orderBy: { [sortBy]: orderBy },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const [total, todos] = await Promise.all([totalPm, todosPm]);
    return new TodoResponseDto({
      totalPage: Math.ceil(total / perPage),
      total,
      page,
      perPage,
      items: todos.map((item) => new TodoDto(item)),
    });
  }

  async getTodoById(userId: string, id: string): Promise<TodoDto> {
    const todo = await this.prisma.todo.findUnique({
      where: { userId, id },
    });
    if (!todo) throw new NotFoundException();
    return new TodoDto(todo);
  }

  async createTodo(userId: string, todoReq: CreateTodoDto): Promise<TodoDto> {
    const todo = await this.prisma.todo.create({
      data: { userId, ...todoReq },
    });
    return new TodoDto(todo);
  }

  async updateTodo(
    userId: string,
    id: string,
    data: UpdateTodoDto,
  ): Promise<TodoDto> {
    const todo = await this.prisma.todo.update({ where: { userId, id }, data });
    return new TodoDto(todo);
  }

  async deleteTodo(userId: string, id: string): Promise<void> {
    try {
      await this.prisma.todo.delete({ where: { userId, id } });
    } catch (error) {
      console.log('error: ', error);
      throw new BadRequestException();
    }
  }
}
