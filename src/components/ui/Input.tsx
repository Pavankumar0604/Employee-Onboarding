import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  registration?: any;
}

import { AlertCircle } from 'lucide-react';

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  registration,
  ...props
}, ref) => {
  const baseStyles = 'block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:border-gray-400 transition-all duration-200 sm:text-sm focus:shadow-lg';
  const errorStyles = 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50 pr-10'; // Added padding-right for icon
  const disabledStyles = 'bg-gray-50 cursor-not-allowed opacity-60';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-mindmesh-text mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          className={`${baseStyles} ${error ? errorStyles : ''} ${props.disabled ? disabledStyles : ''}`}
          autoComplete="off"
          {...props}
          {...registration}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500 animate-pulse">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;