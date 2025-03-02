// src/contexts/ToastContext.tsx
import { createContext, useContext, useState, JSX } from 'react';
import { Toast } from '../components/Toast/Toast';

type ToastConfig = {
  message: string;
  type: 'error' | 'success' | 'warning';
};

type ToastContextType = {
  showToast: (config: ToastConfig) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = (config: ToastConfig) => {
    setToasts((prev) => [...prev, config]);
  };

  const removeToast = (index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            message={toast.message}
            type={toast.type}
            onDismiss={() => removeToast(index)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);