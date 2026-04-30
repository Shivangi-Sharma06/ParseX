import { createContext, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';

const ToastContext = createContext(null);

const typeMap = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn',
  warning: 'warn',
};

export function ToastProvider({ children }) {
  const value = useMemo(
    () => ({
      push: (message, type = 'info', options = {}) => {
        const toastType = typeMap[type] || 'info';
        return toast[toastType](message, options);
      },
      loading: (message, options = {}) => toast.loading(message, options),
      update: (toastId, options = {}) => toast.update(toastId, options),
      dismiss: (toastId) => toast.dismiss(toastId),
    }),
    [],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
