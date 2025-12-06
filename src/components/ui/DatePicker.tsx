import React from 'react';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  onChange?: (date: string) => void; // Custom onChange to return only the date string
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  onChange, // Destructure custom onChange
  ...props
}) => {
  // Updated padding to p-2.5 for visual consistency with other form elements in the dashboard
  const baseStyles = 'block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mindmesh-primary focus:border-mindmesh-primary sm:text-sm';
  const errorStyles = 'border-red-500 focus:ring-red-500 focus:border-red-500';
  const disabledStyles = 'bg-gray-50 cursor-not-allowed';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    // If standard input props are passed, they are handled via {...props}
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-mindmesh-text mb-1">
          {label}
        </label>
      )}
      <input
        type="date"
        id={id}
        className={`${baseStyles} ${error ? errorStyles : ''} ${props.disabled ? disabledStyles : ''}`}
        onChange={handleChange} // Use custom handler
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;