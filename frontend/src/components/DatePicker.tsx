
interface DatePickerProps {
  handleDateChange: (value: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ handleDateChange }) => {
    return (
      <input
        type="date"
        onChange={(e) => handleDateChange(e.target.value)}
        className="border p-2 mt-2"
      />
    );
 
};
