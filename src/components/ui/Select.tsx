import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  children?: React.ReactNode;
  registration?: any; // Add registration prop for react-hook-form
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  id,
  options,
  value,
  onChange,
  error,
  children,
  className,
  registration, // Destructure registration here
  ...props // Capture other HTML select attributes
}, ref) => {
  // The onChange handler from react-hook-form's field will be passed via registration.
  // If a direct onChange is also provided, it will be overridden by {...registration}.
  // For simplicity, we'll rely on react-hook-form's onChange when `registration` is used.
  // If `registration` is not used, the direct `onChange` will work.

  // Styling to match the look of the filters in the image: light background, border, rounded corners, width applied via className.
  // Removed custom arrow wrapper to prevent text overriding issues.
  const baseClasses = "block w-full border border-gray-300 bg-white text-gray-900 p-2 rounded-lg shadow-sm focus:ring-blue-500 focus:border-gray-400 sm:text-sm";
  const errorClass = error ? 'border-red-500' : '';
  const finalClassName = `${baseClasses} ${className || ''} ${errorClass}`;

  return (
    <div >
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={onChange} // Use the provided onChange or let registration handle it
        className={finalClassName}
        {...props} // Spread other HTML select attributes
        {...registration} // Spread the registration props here
        ref={ref}
      >
        {options && options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
});

export default Select