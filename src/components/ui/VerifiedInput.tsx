import React, { useState } from 'react';
import Input from './Input'; // Assuming Input component is available

interface VerifiedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isVerified?: boolean;
  onVerify?: (value: string) => void;
  verificationLoading?: boolean;
  fullWidth?: boolean;
}

const VerifiedInput: React.FC<VerifiedInputProps> = ({
  label,
  error,
  isVerified = false,
  onVerify,
  verificationLoading = false,
  fullWidth = false,
  className = '',
  id,
  value,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>((value as string) || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onVerify && inputValue) {
      onVerify(inputValue);
    }
    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-mindmesh-text mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          id={id}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error}
          fullWidth={fullWidth}
          className="pr-10" // Make space for the icon
          {...props}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {verificationLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-mindmesh-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : isVerified ? (
            <svg
              className="h-5 w-5 text-sky-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : null}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default VerifiedInput;