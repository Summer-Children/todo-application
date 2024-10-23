import axios from "axios";
import { Todo } from "../types/Todo";

const api = axios.create({
  baseURL: "http://localhost:3000", // Backend server base URL
});

export const createTodo = async (
  title: string,
  type: "weekly" | "daily" | "spot",
  date?: string,
  day?: string,
  time?: string
) => {
  const response = await api.post("/todos", {
    title,
    type,
    date,
    day,
    time,
  });
  return response.data;
};

export const fetchTodosForDate = async (date: string) => {
  const response = await api.get(`/todos/date/${date}`);
  return response.data;
};

export const fetcAllTodos = async () =>{
  const response = await api.get(`/todos`);
  return response.data;
}

export const fetchTodosForDay = async (day: string) => {
  const response = await api.get(`/todos/day/${day}`);
  return response.data;
};

export const fetchTodosDaily = async () => {
  const response = await api.get(`/todos/daily`);
  return response.data;
};

export const updateTodo = async (id: string, updatedFields: Partial<Todo>) :Promise<Todo> => {
  const response = await api.patch(`/todos/${id}`, updatedFields);
  return response.data;
};

export const deleteTodo = async (id: string) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
