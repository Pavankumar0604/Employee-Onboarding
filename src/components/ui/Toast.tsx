import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // in milliseconds, 0 for sticky
  onClose?: () => void;
  onDismiss?: () => void; // Added for explicit dismissal handling
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
        if (onDismiss) {
          onDismiss();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  const typeStyles = {
    success: 'bg-sky-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${typeStyles[type]} transition-opacity duration-300 ease-out`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) {
              onClose();
            }
            if (onDismiss) {
              onDismiss();
            }
          }}
          className="ml-4 text-white hover:text-gray-100 focus:outline-none"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Toast;