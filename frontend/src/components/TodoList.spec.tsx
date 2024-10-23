import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoList } from './TodoList';
import { Todo } from '../types/Todo';
import '@testing-library/jest-dom'; 

// Mocking the react-icons/fa module
vi.mock('react-icons/fa', () => ({
  FaEdit: () => <span>Edit Icon</span>,
  FaTrash: () => <span>Trash Icon</span>,
}));

const mockTodos: Todo[] = [
  { _id: '1', title: 'Daily Task', type: 'daily', time: '8:00 AM' },
  { _id: '2', title: 'Weekly Task', type: 'weekly', time: '9:00 AM', day: 'Monday' },
  { _id: '3', title: 'Spot Task', type: 'spot', time: '10:00 AM', date: new Date('2024-10-25') },
];

describe('TodoList Component', () => {
  const updateTodoItem = vi.fn();
  const deleteTodoItem = vi.fn();
  
  const defaultProps = {
    todos: mockTodos,
    selectedDate: new Date('2024-10-25'),
    title: '',
    setTitle: vi.fn(),
    time: '',
    setTime: vi.fn(),
    type: '',
    handleTypeChange: vi.fn(),
    handleDateChange: vi.fn(),
    handleDayChange: vi.fn(),
    updateTodoItem,
    deleteTodoItem,
  };

  it('should render todos', () => {
    render(<TodoList {...defaultProps} />);

    expect(screen.getByText(/Daily Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Spot Task/i)).toBeInTheDocument();
  });

  it('should open the edit modal when the edit button is clicked', () => {
    render(<TodoList {...defaultProps} />);

    fireEvent.click(screen.getAllByLabelText(/Edit item/i)[0]);
    expect(screen.getAllByText(/Edit Todo/i)[0]).toBeInTheDocument();
  });

  it('should open the delete modal when the delete button is clicked', () => {
    render(<TodoList {...defaultProps} />);

    fireEvent.click(screen.getAllByLabelText(/Delete item/i)[0]);
    expect(screen.getAllByText(/Are you sure you want to delete this todo item?/i)[0]).toBeInTheDocument();
  });

  it('should call deleteTodoItem with the correct ID when delete is confirmed', () => {
    render(<TodoList {...defaultProps} />);

    const deleteButton = screen.getAllByLabelText(/Delete item/i)[0]; 
    fireEvent.click(deleteButton);

    const yesButtons = screen.getAllByText(/Yes/i);
    fireEvent.click(yesButtons[0]);

    const selectedTodoId = mockTodos[0]._id;
    expect(deleteTodoItem).toHaveBeenCalledWith(selectedTodoId);
  });

  it('should call updateTodoItem with the correct ID when edit button in the modal is confirmed', () => {
    render(<TodoList {...defaultProps} />);
  
    const editButton = screen.getAllByLabelText(/Edit item/i)[0]; 
    fireEvent.click(editButton);
  
    const editButtons = screen.getAllByText(/Edit/i);
    fireEvent.click(editButtons[1]); 
  
    const selectedTodoId = mockTodos[0]._id;
  
    expect(updateTodoItem).toHaveBeenCalledWith(selectedTodoId, {
      title: mockTodos[0].title,
      time: mockTodos[0].time,
      type: mockTodos[0].type,
      day: mockTodos[0].day,
      date: mockTodos[0].date,
    });
  });
});
