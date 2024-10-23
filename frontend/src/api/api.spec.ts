import { describe, it, expect, beforeEach, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  createTodo,
  fetchTodosForDate,
  fetcAllTodos,
  fetchTodosForDay,
  fetchTodosDaily,
  updateTodo,
  deleteTodo,
} from "./api";
import { Todo } from "../types/Todo";

describe("API tests", () => {
  let mock: MockAdapter;

  // Set up the mock adapter before each test
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  // Reset the adapter and restore to default state after each test
  afterEach(() => {
    mock.reset();
  });

  it("should create a daily todo", async () => {
    const mockData: Todo = {
      title: "Daily Todo",
      type: "daily",
      date: null,
      day: null,
      time: "08:00",
    };

    mock.onPost("/todos").reply(201, mockData);

    const response = await createTodo(
      mockData.title,
      mockData.type,
      undefined,
      undefined,
      mockData.time
    );

    expect(response).toEqual(mockData);
  });

  it("should create a weekly todo with a specific day", async () => {
    const mockData: Todo = {
      title: "Weekly Todo",
      type: "weekly",
      date: null,
      day: "Sunday", 
      time: "10:00",
    };

    mock.onPost("/todos").reply(201, mockData);

    const response = await createTodo(
      mockData.title,
      mockData.type,
      undefined,
      mockData.day ?? undefined,
      mockData.time
    );

    expect(response).toEqual(mockData);
  });

  it("should create a spot todo with a specific date", async () => {
    const mockData: Todo = {
      title: "Spot Todo",
      type: "spot",
      date: new Date("2024-10-30"),
      day: null,
      time: "15:00",
    };

    mock.onPost("/todos").reply(201, mockData);

    const response = await createTodo(
      mockData.title,
      mockData.type,
      (mockData.date as Date).toISOString(),
      undefined,
      mockData.time
    );

    expect(response.date ? new Date(response.date) : null).toEqual(mockData.date);
    expect(response.time).toBe(mockData.time);
  });

  it("should fetch all todos for a specific date", async () => {
    const mockData: Todo[] = [
      {
        title: "Spot Todo",
        type: "spot",
        date: new Date("2024-10-30"),
        day: null,
        time: "09:00",
      },
      {
        title: "Weekly Todo",
        type: "weekly",
        date: null,
        day: "Wednesday",
        time: "12:00",
      },
    ];

    mock.onGet("/todos/date/2024-10-30").reply(200, mockData);

    const response = await fetchTodosForDate("2024-10-30");

    // Convert date strings back to Date objects for comparison
    const formattedResponse = response.map((todo: Todo) => ({
      ...todo,
      date: todo.date ? new Date(todo.date) : null,
    }));

    expect(formattedResponse).toEqual(mockData);
  });

  it("should fetch all todos", async () => {
    const mockData: Todo[] = [
      {
        title: "Daily Todo",
        type: "daily",
        date: null,
        day: null,
        time: "07:00",
      },
      {
        title: "Weekly Todo",
        type: "weekly",
        date: null,
        day: "Monday",
        time: "10:00",
      },
      {
        title: "Spot Todo",
        type: "spot",
        date: new Date("2024-10-30"),
        day: null,
        time: "15:00",
      },
    ];

    mock.onGet("/todos").reply(200, mockData);

    const response = await fetcAllTodos();

    // Convert date strings back to Date objects for comparison
    const formattedResponse = response.map((todo: Todo) => ({
      ...todo,
      date: todo.date ? new Date(todo.date) : null,
    }));

    expect(formattedResponse).toEqual(mockData);
  });

  it("should fetch todos for a specific day", async () => {
    const mockData: Todo[] = [
      {
        title: "Weekly Todo",
        type: "weekly",
        date: null,
        day: "Monday",
        time: "08:00",
      },
      {
        title: "Weekly Todo",
        type: "weekly",
        date: null,
        day: "Monday",
        time: "10:30",
      },
    ];

    mock.onGet("/todos/day/Monday").reply(200, mockData);

    const response = await fetchTodosForDay("Monday");

    expect(response).toEqual(mockData);
  });

  it("should fetch all daily todos", async () => {
    const mockData: Todo[] = [
      {
        title: "Daily Todo 1",
        type: "daily",
        date: null,
        day: null,
        time: "06:00",
      },
      {
        title: "Daily Todo 2",
        type: "daily",
        date: null,
        day: null,
        time: "09:00",
      },
    ];

    mock.onGet("/todos/daily").reply(200, mockData);

    const response = await fetchTodosDaily();

    expect(response).toEqual(mockData);
  });

  it("should update a spot todo", async () => {
    const mockData: Todo = {
      id: "123",
      title: "Updated Spot Todo",
      type: "spot",
      date: new Date("2024-11-01"),
      day: null,
      time: "14:00",
    };

    mock.onPatch("/todos/123").reply(200, mockData);

    const response = await updateTodo("123", {
      title: "Updated Spot Todo",
      date: mockData.date,
      time: "14:00",
    });

    expect(response.date ? new Date(response.date) : null).toEqual(mockData.date);
    expect(response.time).toBe(mockData.time);
  });

  it("should delete a todo", async () => {
    const mockData: Todo = {
      id: "123",
      title: "Delete Spot Todo",
      type: "spot",
      date: new Date("2024-11-01"),
      day: null,
      time: "14:00",
    };;

    mock.onDelete("/todos/123").reply(200, mockData);

    const response = await deleteTodo("123");

    expect(response).toEqual(mockData);
  });
});
