import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findAllForDate: jest.fn(),
            findAllForDay: jest.fn(),
            findAllDaily: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should create a new todo', async () => {
    const todoData = {
      title: 'Test Todo',
      type: 'spot' as const,
      time: '2:00 PM',
      date: new Date('2024-10-25').toISOString(),
    };

    const createdTodo = { ...todoData, date: new Date(todoData.date) };

    jest.spyOn(service, 'create').mockResolvedValue(createdTodo);

    const result = await controller.create(todoData);
    expect(result).toEqual(createdTodo);
  });

  it('should fetch all todos', async () => {
    const todos = [
      { title: 'Test Todo 1', type: 'daily' as const, time: '10:00 AM' },
      {
        title: 'Test Todo 2',
        type: 'weekly' as const,
        time: '11:00 AM',
        day: 'Monday',
      },
      {
        title: 'Test Todo 3',
        type: 'spot' as const,
        time: '1:00 PM',
        date: new Date('2024-10-26'),
      },
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(todos);

    const result = await controller.findAll();
    expect(result).toEqual(todos);
  });

  it('should fetch todos for a specific date', async () => {
    const date = new Date('2024-10-26').toISOString(); // DTO formatted date
    const todos = [
      {
        title: 'Event',
        type: 'spot' as const,
        date: new Date(date),
        time: '2:00 PM',
      },
    ];
    jest.spyOn(service, 'findAllForDate').mockResolvedValue(todos);

    const result = await controller.findAllForDate(date);
    expect(result).toEqual(todos);
  });

  it('should fetch todos for a specific day', async () => {
    const day = 'Monday';
    const todos = [
      {
        title: 'Weekly Meeting',
        type: 'weekly' as const,
        day,
        time: '9:00 AM',
      },
    ];
    jest.spyOn(service, 'findAllForDay').mockResolvedValue(todos);

    const result = await controller.findAllForDay(day);
    expect(result).toEqual(todos);
  });

  it('should fetch daily todos', async () => {
    const todos = [
      { title: 'Daily Standup', type: 'daily' as const, time: '8:30 AM' },
    ];
    jest.spyOn(service, 'findAllDaily').mockResolvedValue(todos);

    const result = await controller.findAllDaily();
    expect(result).toEqual(todos);
  });

  it('should update a todo', async () => {
    const id = '12345';
    const updateData = {
      title: 'Updated Todo',
      type: 'spot' as const,
      time: '11:00 AM',
      date: new Date('2024-10-27').toISOString(), // DTO formatted date
    };
    const updatedTodo = {
      _id: id,
      ...updateData,
      date: new Date(updateData.date),
      // conver to Date object
    };

    jest.spyOn(service, 'update').mockResolvedValue(updatedTodo);

    const result = await controller.update(id, updateData);
    expect(result).toEqual(updatedTodo);
  });

  it('should delete a todo', async () => {
    const id = '12345';
    const deletedTodo = {
      _id: id,
      title: 'Deleted Todo',
      type: 'spot' as const,
      time: '3:00 PM',
      date: new Date('2024-10-28').toISOString(), // DTO formatted date
    };
    const resolvedDeletedTodo = {
      ...deletedTodo,
      date: new Date(deletedTodo.date),
    }; // conver to Date object

    jest.spyOn(service, 'delete').mockResolvedValue(resolvedDeletedTodo);

    const result = await controller.delete(id);
    expect(result).toEqual(resolvedDeletedTodo);
  });
});
