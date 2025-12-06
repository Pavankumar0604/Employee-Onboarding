import React from 'react';

/**
 * @description Props for the Button component.
 */
interface ButtonProps {
  /**
   * @description The content to display within the button.
   */
  children: React.ReactNode;
  /**
   * @description The function to call when the button is clicked.
   */
  onClick: () => void;
  /**
   * @description The visual variant of the button.
   */
  variant?: 'primary' | 'secondary';
  /**
   * @description Optional CSS class names to apply to the button.
   */
  className?: string;
  /**
   * @description Whether the button is disabled.
   */
  disabled?: boolean;
}

/**
 * @description A reusable button component with different variants.
 * @param {ButtonProps} props - The props for the Button component.
 * @returns {JSX.Element} The rendered Button component.
 */

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg";
  const primaryStyle = "bg-sky-400 text-white hover:bg-sky-500";
  const secondaryStyle = "bg-gray-100 text-sky-700 border border-gray-300 hover:bg-gray-200 shadow-sm";
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;