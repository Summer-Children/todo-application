import React, { useState } from "react";
import { Todo } from "../types/Todo";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Modal,
  Button,
  TitleInput,
  TimeInput,
  DatePicker,
  DayPicker,
  TypePicker,
} from "./index";

interface TodoListProps {
  todos: Todo[];
  selectedDate: Date | null;
  title: string;
  setTitle: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  type: string;
  handleTypeChange: (value: string) => void;
  handleDateChange: (value: string) => void;
  handleDayChange: (value: string) => void;
  updateTodoItem: (id: string, updatedFields: Partial<Todo>) => void;
  deleteTodoItem: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  selectedDate,
  updateTodoItem,
  deleteTodoItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<boolean>(false);

  // the value that user has chosen through the edit modal
  const [editTitle, setEditTitle] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editType, setEditType] = useState<string>("");
  const [editDay, setEditDay] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");

  const editModalOpen = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditTitle(todo.title);
    setEditTime(todo.time || "");
    setEditType(todo.type);
    setEditDay(todo.day || "");
    setEditDate(
      todo.date ? new Date(todo.date).toISOString().split("T")[0] : ""
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const openDeleteConfirmation = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
    setSelectedTodo(null);
  };

  const confirmDelete = () => {
    if (selectedTodo) {
      deleteTodoItem(selectedTodo._id);
      setIsDeleteConfirmationOpen(false);
      setSelectedTodo(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl mg:text-3xl font-semibold py-2">
        Todos for {selectedDate?.toDateString()}
      </h2>
      {todos.length > 0 ? (
        <ul className="list-disc pl-5">
          {todos.map((todo) => (
            <div key={todo._id} className="flex gap-3">
              <li className="mb-1">
                <span className="font-medium">{todo.title}</span> at{" "}
                <span>{todo.time}</span>
              </li>

              <button
                aria-label="Edit item"
                className="flex items-center gap-2 text-red-500 hover:text-red-800"
                onClick={() => editModalOpen(todo)}
              >
                <FaEdit />
              </button>

              <button
                aria-label="Delete item"
                className="flex items-center gap-2 text-red-500 hover:text-red-800"
                onClick={() => openDeleteConfirmation(todo)}
              >
                <FaTrash />
              </button>

              {/* Display the edit modal when a user clicks the edit icon */}
              {isModalOpen && selectedTodo && (
                <Modal onClose={closeModal}>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold">Edit Todo</h2>
                    <p>
                      Editing: {selectedTodo.title} at {selectedTodo.time}
                    </p>

                    <TitleInput title={editTitle} setTitle={setEditTitle} />
                    <TimeInput time={editTime} setTime={setEditTime} />
                    <TypePicker
                      selected={editType}
                      handleTypeChange={setEditType}
                    />

                    {editType === "spot" && (
                      <DatePicker
                        handleDateChange={(value) => setEditDate(value)}
                      />
                    )}

                    {editType === "weekly" && (
                      <DayPicker
                        handleDayChange={(value) => setEditDay(value)}
                      />
                    )}

                    <div className="flex gap-3">
                      <Button
                        handleOnClick={closeModal}
                        className="grow bg-slate-500 text-white"
                      >
                        Close
                      </Button>

                      <Button
                        handleOnClick={() => {
                          if (selectedTodo) {
                            updateTodoItem(selectedTodo._id, {
                              title: editTitle,
                              time: editTime,
                              type: editType as "weekly" | "daily" | "spot",
                              day: editDay,
                              date: editDate ? new Date(editDate) : undefined,
                            });
                            closeModal();
                          }
                        }}
                        className="grow bg-blue-500 text-white"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </Modal>
              )}

              {/* Display the delete confirmation modal */}
              {isDeleteConfirmationOpen && selectedTodo && (
                <Modal onClose={closeDeleteConfirmation}>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold">
                      Are you sure you want to delete this todo item?
                    </h2>
                    <div className="flex gap-3">
                      <Button
                        handleOnClick={closeDeleteConfirmation}
                        className="bg-gray-500 text-white"
                      >
                        No
                      </Button>
                      <Button
                        handleOnClick={confirmDelete}
                        className="bg-red-500 text-white"
                      >
                        Yes
                      </Button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-lg mg:text-xl lg:2xl">No todos for this date.</p>
      )}
    </div>
  );
};
