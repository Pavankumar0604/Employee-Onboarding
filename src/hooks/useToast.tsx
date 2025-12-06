import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import Toast from '../components/ui/Toast';

interface ToastOptions {
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // in milliseconds, 0 for sticky
  onClose?: () => void;
}

interface ToastState extends ToastOptions {
  id: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
  toasts: ToastState[];
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, message, ...options }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
      {toasts.map((toast: ToastState) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={() => {
            removeToast(toast.id);
            toast.onClose && toast.onClose();
          }}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context as ToastContextType;
};