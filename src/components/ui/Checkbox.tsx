import React from 'react';

interface CheckboxProps {
  id: string;
  label?: string;
  description?: string; // Added description prop
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  description, // Destructure description
  checked,
  onChange,
  disabled = false,
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleCheckboxChange}
          disabled={disabled}
          className="form-checkbox h-4 w-4 text-crimson rounded focus:ring-charcoal disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        />
      </div>
      <div className="ml-3 text-sm">
        {label && (
          <label htmlFor={id} className="font-medium text-primary-text cursor-pointer">
            {label}
          </label>
        )}
        {description && (
          <p className="text-muted mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;