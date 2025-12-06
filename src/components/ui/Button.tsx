import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'icon' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  borderRadius?: string;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  borderRadius,
  ...props
}) => {
  const baseStyles = `font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out flex items-center justify-center ${borderRadius ? borderRadius : ''}`;

  const variantStyles = {
    primary: 'bg-sky-400 text-white hover:bg-sky-500 focus:ring-sky-300 hover:-translate-y-0.5 hover:shadow-sky-400/40',
    secondary: 'bg-gray-100 text-sky-700 hover:bg-gray-200 focus:ring-gray-300 hover:-translate-y-0.5 hover:shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 hover:-translate-y-0.5 hover:shadow-red-600/40',
    success: 'bg-sky-400 text-white hover:bg-sky-500 focus:ring-sky-300 hover:-translate-y-0.5 hover:shadow-sky-400/40',
    ghost: 'bg-transparent text-sky-700 hover:bg-gray-100 focus:ring-gray-300 hover:-translate-y-0.5',
    icon: 'bg-transparent text-sky-700 hover:bg-gray-100 focus:ring-gray-300 p-2 rounded-full hover:-translate-y-0.5',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-300 hover:-translate-y-0.5 hover:shadow-lg',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px] sm:px-8',
    lg: 'px-8 py-4 text-base sm:text-lg min-h-[48px]',
  };

  const finalSizeStyles = variant === 'icon' ? '' : sizeStyles[size];

  const disabledStyles = 'opacity-50 cursor-not-allowed';
  const loadingStyles = 'relative !cursor-wait';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${finalSizeStyles}${className} ${disabled || loading ? disabledStyles : ''
        } ${loading ? loadingStyles : ''} ${fullWidth ? 'w-full' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-white"
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
        </span>
      )}
      <span className={`flex items-center gap-2 ${loading ? 'invisible' : ''}`}>
        {icon}
        {children}
      </span>
    </button>
  );
};

export default Button;