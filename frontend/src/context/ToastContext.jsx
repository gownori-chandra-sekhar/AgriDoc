import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000, action }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type, action }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, title = 'Success') => addToast({ title, message: msg, type: 'success' }),
    error: (msg, title = 'Error') => addToast({ title, message: msg, type: 'error', duration: 6000 }),
    warning: (msg, title = 'Warning') => addToast({ title, message: msg, type: 'warning' }),
    info: (msg, title = 'Info') => addToast({ title, message: msg, type: 'info' }),
    custom: addToast,
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Overlay Container */}
      <div
        aria-live="polite"
        className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl p-4 border shadow-xl bg-white backdrop-blur-md transition-all duration-300 animate-slide-up ${
              t.type === 'success'
                ? 'border-emerald-200 text-emerald-900 bg-emerald-50/95'
                : t.type === 'error'
                ? 'border-rose-200 text-rose-900 bg-rose-50/95'
                : t.type === 'warning'
                ? 'border-amber-200 text-amber-900 bg-amber-50/95'
                : 'border-sky-200 text-sky-900 bg-sky-50/95'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-600" />}
              {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-sky-600" />}
            </div>

            <div className="flex-1 space-y-0.5">
              {t.title && <h4 className="text-xs font-black text-slate-900">{t.title}</h4>}
              <p className="text-xs text-slate-700 leading-relaxed">{t.message}</p>
              {t.action && (
                <button
                  onClick={() => {
                    t.action.onClick();
                    removeToast(t.id);
                  }}
                  className="mt-1.5 inline-block text-[11px] font-bold text-emerald-700 underline hover:text-emerald-900"
                >
                  {t.action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss toast"
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
