import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { CreateTodoDto } from './data-transfer-object/create-todo.dto';
import { UpdateTodoDto } from './data-transfer-object/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      // Use the model's create method instead of "new"
      const createdTodo = await this.todoModel.create(createTodoDto);
      return createdTodo;
    } catch (error) {
      console.error('Error creating todo:', error.message);
      throw new Error('Failed to create todo');
    }
  }

  async findAll(): Promise<Todo[]> {
    try {
      console.log('Fetching todos');
      return await this.todoModel.find().exec();
    } catch (error) {
      console.error('Error fetching todos:', error.message);
      throw new Error('Failed to fetch todos');
    }
  }

  //type についてのデータも検索条件対象に入れておくとシンプル。
  async findAllForDate(date: Date): Promise<Todo[]> {
    try {
      return await this.todoModel.find({ date }).exec();
    } catch (error) {
      console.error('Error fetching todos for date:', error.message);
      throw new Error('Failed to fetch todos for the specified date');
    }
  }

  async findAllForDay(day: string): Promise<Todo[]> {
    try {
      return await this.todoModel.find({ day }).exec();
    } catch (error) {
      console.error('Error fetching todos for day:', error.message);
      throw new Error('Failed to fetch todos for the specified day');
    }
  }

  async findAllDaily(): Promise<Todo[]> {
    try {
      return await this.todoModel.find({ type: 'daily' }).exec();
    } catch (error) {
      console.error('Error fetching daily todos:', error.message);
      throw new Error('Failed to fetch daily todos');
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    try {
      return await this.todoModel
        .findByIdAndUpdate(id, updateTodoDto, { new: true })
        .exec();
    } catch (error) {
      console.error('Error updating todo:', error.message);
      throw new Error('Failed to update todo');
    }
  }

  async delete(id: string): Promise<Todo> {
    try {
      return await this.todoModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error('Error deleting todo:', error.message);
      throw new Error('Failed to delete todo');
    }
  }

  async deleteAllForDate(date: Date): Promise<void> {
    try {
      await this.todoModel.deleteMany({ date }).exec();
    } catch (error) {
      console.error('Error deleting all todos for the date:', error.message);
      throw new Error('Failed to delete todos for the specified date');
    }
  }
}
