import React from "react";

interface TitleInputProps {
  title: string;
  setTitle: (value: string) => void;
}

export const TitleInput: React.FC<TitleInputProps> = ({ title, setTitle }) => {
  return (
    <div>
      <label className="flex gap-2 items-center" htmlFor="title">
        To Do
      </label>
      <input
        id="title"
        type="text"
        placeholder="Enter Todo Item"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
      />
    </div>
  );
};
