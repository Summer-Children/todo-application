import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Todo } from '../types/Todo';

interface CalendarViewProps {
  todos: Todo[];
  onDateSelect: (selectedDate: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ todos, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      onDateSelect(value); // Pass the selected date to the parent component
    }
  };

  return (
    <div className='py-2'>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        selectRange={false}
      />
      {selectedDate && (
        <div>
          {todos
            .filter((todo) => todo.date && new Date(todo.date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0])
            .map((todo) => (
              <div key={todo._id} className="flex items-center mb-2">
                <button className={`px-2 py-1 rounded ${getButtonColor(todo.type)}`}>
                  {todo.title} @ {todo.time}
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const getButtonColor = (type: 'weekly' | 'daily' | 'spot') => {
  switch (type) {
    case 'weekly':
      return 'bg-orange-500';
    case 'daily':
      return 'bg-green-500';
    case 'spot':
      return 'bg-blue-500';
    default:
      return '';
  }
};
