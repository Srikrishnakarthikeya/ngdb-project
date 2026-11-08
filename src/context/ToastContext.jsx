import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-emerald-800 text-white border-emerald-700',
            error: 'bg-rose-800 text-white border-rose-700',
            warning: 'bg-amber-800 text-white border-amber-700',
            info: 'bg-slate-900 text-white border-slate-700'
          }[toast.type] || 'bg-slate-900 text-white border-slate-700';

          const icon = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />,
            info: <Info className="w-5 h-5 text-blue-300 flex-shrink-0" />
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-lg border text-sm font-medium transition-all transform translate-y-0 opacity-100 ${typeStyles}`}
            >
              <div className="flex items-center space-x-3">
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
