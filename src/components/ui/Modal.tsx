import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-full sm:max-w-sm',
    md: 'w-full sm:max-w-md',
    lg: 'w-full sm:max-w-lg md:max-w-xl',
    xl: 'w-full sm:max-w-xl md:max-w-2xl',
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl transform transition-all m-0 sm:m-4 ${sizeClasses[size]} max-h-[100vh] sm:max-h-[90vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby="modal-description"
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <button
            type="button"
            className="p-2 sm:p-3 bg-white rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Header */}
        {title && (
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <h3 id="modal-title" className="text-lg sm:text-xl font-semibold text-gray-900 text-center pr-10">
              {title}
            </h3>
          </div>
        )}

        {/* Modal Body */}
        <div id="modal-description" className="p-4 sm:p-6 overflow-y-auto flex-grow text-sm sm:text-base">{children}</div>

        {/* Modal Footer */}
        {onConfirm && (
          <div className="px-4 py-4 sm:px-6 sm:py-5 bg-gray-50 flex flex-col sm:flex-row justify-center gap-3 sm:space-x-3 rounded-b-3xl sticky bottom-0">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-150 min-h-[44px]"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-medium text-white bg-red-600 border border-transparent rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors duration-150 min-h-[44px]"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;