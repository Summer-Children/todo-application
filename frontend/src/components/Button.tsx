import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  // 以下のtype script errorは無視
  handleOnClick: (...args: any[]) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, handleOnClick, disabled, className }) => {
  return (
    <button
      className={`px-4 py-2 rounded ${className} ${disabled ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
      onClick={(event) => handleOnClick(event)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
