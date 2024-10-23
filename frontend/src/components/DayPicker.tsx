interface DayPickerProps {
  handleDayChange: (value: string) => void;
}

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DayPicker: React.FC<DayPickerProps> = ({ handleDayChange }) => {
    return(
  <select
    id="weekday"
    onChange={(e) => handleDayChange(e.target.value)}
    className="border p-2"
    defaultValue=""
  >
    <option value="" disabled>
      -- Select a day --
    </option>
    {weekdays.map((day, index) => (
      <option key={index} value={day}>
        {day}
      </option>
    ))}
  </select>
    )
};
