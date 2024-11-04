import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './data-transfer-object/create-todo.dto';
import { UpdateTodoDto } from './data-transfer-object/update-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  async findAll() {
    return this.todoService.findAll();
  }

  @Get('date/:date')
  async findAllForDate(@Param('date') date: string) {
    const dateObj = new Date(date); // Convert string to Date object
    return this.todoService.findAllForDate(dateObj);
  }

  @Get('day/:day')
  async findAllForDay(@Param('day') day: string) {
    return this.todoService.findAllForDay(day);
  }

  @Get('daily')
  async findAllDaily() {
    return this.todoService.findAllDaily();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.todoService.delete(id);
  }

  @Delete('date/:date')
  async deleteAll(@Param('date') date: string) {
    const dateObj = new Date(date);
    return this.todoService.deleteAllForDate(dateObj);
  }
}
