import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colorClass = type === 'success' ? 'bg-sky-500' : 'bg-red-500';
    
    // Using fixed positioning for toast
    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg text-white shadow-lg transition-transform duration-300 transform translate-y-0 ${colorClass}`}>
            {message}
        </div>
    );
};

export default Toast;