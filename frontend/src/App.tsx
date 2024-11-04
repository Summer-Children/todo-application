import React, { useState, useEffect } from "react";
import {
  createTodo,
  fetchTodosForDate,
  fetchTodosForDay,
  fetchTodosDaily,
  updateTodo,
  deleteTodo,
  deleteAllTodo,
} from "./api/api";
import {
  TypePicker,
  DatePicker,
  DayPicker,
  Button,
  CalendarView,
  TitleInput,
  TimeInput,
} from "./components/index";
import { TodoList } from "./components/TodoList"; // Import the new component
import { Todo } from "./types/Todo";

export const App: React.FC = () => {
  const [todos] = useState<Todo[]>([]);
  const [displayedTodos, setDisplayedTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Enable the "Add Todo" button only when all required fields are filled
  useEffect(() => {
    if (
      (type === "weekly" && title && time && day) ||
      (type === "daily" && title && time) ||
      (type === "spot" && title && time && date)
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, type, time, date, day]);

  const handleTypeChange = (value: string) => {
    setType(value);
    setDate("");
    setDay("");
  };

  const handleDateChange = (value: string) => {
    setDate(value);
  };

  const handleDayChange = (value: string) => {
    setDay(value);
  };

  const addTodoToServer = async () => {
    try {
      await createTodo(
        title,
        type as "weekly" | "daily" | "spot",
        // pass the date as a string format
        date,
        day,
        time
      );
      setTitle("");
      setTime("");
      setType("");
      setDate("");
      setDay("");
      if (selectedDate) {
        fetchTodosByDate(selectedDate.toISOString().split("T")[0]); // Refresh the list after adding
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const fetchTodosByDate = async (selectedDate: string) => {
    try {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0]; // Ensure the date is in 'YYYY-MM-DD' format
      const res = await fetchTodosForDate(formattedDate);
      return res;
    } catch (error) {
      console.error("Error fetching todos by date:", error);
      return [];
    }
  };

  const fetchTodosByDay = async (selectedDay: string) => {
    try {
      const res = await fetchTodosForDay(selectedDay);
      return res;
    } catch (error) {
      console.error("Error fetching todos by day:", error);
      return [];
    }
  };

  const fetchDailyTodos = async () => {
    try {
      const res = await fetchTodosDaily();
      return res;
    } catch (error) {
      console.error("Error fetching daily todos:", error);
      return [];
    }
  };

  const showTodosList = async (selectedDate: Date) => {
    setSelectedDate(selectedDate);

    const dateString = selectedDate.toISOString().split("T")[0]; // Ensure the date is formatted correctly

    // 1. Fetch todos items on the selectedDate
    const todosByDate = await fetchTodosByDate(dateString);

    // 2. Fetch todos items based on the same day as selectedDate (e.g., "Monday")
    const dayString = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const selectedDayString = dayString[selectedDate.getDay()];
    const todosByDay = await fetchTodosByDay(selectedDayString);

    // 3. If the selectedDate is a weekday (Monday to Friday), fetch all daily todos
    let dailyTodos: Todo[] = [];
    if (selectedDate.getDay() >= 1 && selectedDate.getDay() <= 5) {
      dailyTodos = await fetchDailyTodos();
    }

    // Display all of the above 1, 2, and 3 todo items
    const allFetchedTodos = [...todosByDate, ...todosByDay, ...dailyTodos];
    setDisplayedTodos(allFetchedTodos);
  };

  const updateTodoItem = async (id: string, editedFields: Partial<Todo>) => {
    try {
      // editedField reprensents the fields that are being edited through edit modal by the user
      // updatedFields will be the final fields that will be sent to the API to update the todo item
      // (趣旨：ユーザーがtypeの種類を変えた場合は、それに伴い古いデータにおけるdate/dayについても変更が必要となるため、以下のif statementが必要)
      const updatedFields = { ...editedFields };

      if (editedFields.type === "weekly") {
        updatedFields.day = editedFields.day;
        updatedFields.date = null;
      } else if (editedFields.type === "daily") {
        updatedFields.date = editedFields.date;
        updatedFields.day = null;

        // spotからspot以外に変更した際、1つのtodoが重複表示されるのを防ぐため
        updatedFields.date = null;
      } else if (editedFields.type === "spot") {
        updatedFields.date = editedFields.date;
        updatedFields.day = null;
      }

      await updateTodo(id, updatedFields);

      setDisplayedTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, ...updatedFields } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodoItem = async (id: string) => {
    try {
      await deleteTodo(id);

      if (selectedDate) {
        await showTodosList(selectedDate);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const deleteAllTodoItem = async () => {
    let formattedDate;

    if (selectedDate) {
      formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      await deleteAllTodo(formattedDate);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center gap-4 min-h-screen max-w-2xl mx-auto p-5">
      <h1 className="font-semibold grow text-3xl text-center md:text-4xl flex items-center p-3">
        Todo Management
      </h1>

      <div className="flex flex-col gap-3 w-full px-7 max-w-lg">
        <TitleInput title={title} setTitle={setTitle} />
        <TimeInput time={time} setTime={setTime} />
        <TypePicker selected={type} handleTypeChange={handleTypeChange} />

        {type === "spot" && <DatePicker handleDateChange={handleDateChange} />}

        {type === "weekly" && <DayPicker handleDayChange={handleDayChange} />}

        <Button
          handleOnClick={addTodoToServer}
          disabled={isButtonDisabled}
          className="w-1/2 self-center"
        >
          Add Todo
        </Button>
      </div>

      <CalendarView todos={todos} onDateSelect={showTodosList} />

      <div className="grow">
        <TodoList
          todos={displayedTodos}
          selectedDate={selectedDate}
          title={title}
          setTitle={setTitle}
          time={time}
          setTime={setTime}
          type={type}
          handleTypeChange={handleTypeChange}
          handleDateChange={handleDateChange}
          handleDayChange={handleDayChange}
          updateTodoItem={updateTodoItem}
          deleteTodoItem={deleteTodoItem}
          deleteAllTodoItem={deleteAllTodoItem}
        />
      </div>
    </div>
  );
};
