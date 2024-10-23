import React from "react";

interface TimeInputProps {
  time: string;
  setTime: (value: string) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({ time, setTime }) => {
  return (
    <div>
      <label className="flex flex-col gap-2" htmlFor="time">
        Time
      </label>
      <input
        id="time"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border p-2 w-full"
      />
    </div>
  );
};
