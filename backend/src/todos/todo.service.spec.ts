import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';

describe('TodoService', () => {
  let service: TodoService;
  let model: Model<TodoDocument>;

  beforeEach(async () => {
    // create mock model by using "createTestingModule" to replace the real Mongoose model
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken(Todo.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    model = module.get<Model<TodoDocument>>(getModelToken(Todo.name));
  });

  it('should create a new todo', async () => {
    const todoData = {
      title: 'Test Todo',
      type: 'daily' as const,
      time: '10:00 AM',
    };

    // Mock the behavior of Mongoose model instance creation
    const mockTodoInstance = {
      ...todoData,
      save: jest.fn().mockResolvedValue(todoData),
    };

    (model as any).create.mockReturnValue(mockTodoInstance);

    const result = await service.create(todoData);
    expect(result.title).toEqual(todoData.title);
    expect(result.type).toEqual(todoData.type);
    expect(result.time).toEqual(todoData.time);
  });

  it('should fetch all todos', async () => {
    const todos = [{ title: 'Test Todo', type: 'daily', time: '10:00 AM' }];
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(todos),
    } as any);

    const result = await service.findAll();
    expect(result).toEqual(todos);
  });

  it('should fetch todos for a specific date', async () => {
    const date = new Date('2024-10-20');
    const todos = [{ title: 'Event', type: 'spot', date, time: '2:00 PM' }];
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(todos),
    } as any);

    const result = await service.findAllForDate(date);
    expect(result).toEqual(todos);
  });

  it('should fetch todos for a specific day', async () => {
    const day = 'Monday';
    const todos = [
      { title: 'Weekly Meeting', type: 'weekly', day, time: '9:00 AM' },
    ];
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(todos),
    } as any);

    const result = await service.findAllForDay(day);
    expect(result).toEqual(todos);
  });

  it('should fetch daily todos', async () => {
    const todos = [{ title: 'Daily Standup', type: 'daily', time: '8:30 AM' }];
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(todos),
    } as any);

    const result = await service.findAllDaily();
    expect(result).toEqual(todos);
  });

  it('should update a todo', async () => {
    const id = '12345';
    const updateData = {
      title: 'Updated Todo',
      type: 'daily' as const,
      time: '11:00 AM',
    };
    const updatedTodo = { _id: id, ...updateData };

    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedTodo),
    } as any);

    const result = await service.update(id, updateData);
    expect(result).toEqual(updatedTodo);
  });

  it('should delete a todo', async () => {
    const id = '12345';
    const deletedTodo = {
      _id: id,
      title: 'Deleted Todo',
      type: 'spot',
      time: '3:00 PM',
    };

    jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValue(deletedTodo),
    } as any);

    const result = await service.delete(id);
    expect(result).toEqual(deletedTodo);
  });
});
