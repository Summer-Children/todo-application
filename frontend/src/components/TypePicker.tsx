import React from 'react';

interface TypePickerProps {
  selected: string;
  handleTypeChange: (value: string) => void;
}


export const TypePicker: React.FC<TypePickerProps> = ({ selected, handleTypeChange }) => {
  
  const options=["weekly", "daily", "spot"]

  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <label key={option} className="grow flex items-center  space-x-2 text-center">
          <input
            type="radio"
            name="todo-type"
            value={option}
            checked={selected === option}
            onChange={() => handleTypeChange(option)} 
            className='grow'
          />
          <span className='grow text-left'>{option}</span>
        </label>
      ))}
    </div>
  );
};