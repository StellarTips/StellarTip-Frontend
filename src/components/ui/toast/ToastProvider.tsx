"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-primary-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  };

  const bgStyles = {
    success: "bg-white border-green-200 dark:bg-surface-800 dark:border-green-800",
    error: "bg-white border-red-200 dark:bg-surface-800 dark:border-red-800",
    info: "bg-white border-primary-200 dark:bg-surface-800 dark:border-primary-800",
    warning: "bg-white border-amber-200 dark:bg-surface-800 dark:border-amber-800",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg min-w-[300px] max-w-md",
        "animate-in slide-in-from-bottom-2 fade-in duration-300",
        bgStyles[toast.type]
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-surface-900 dark:text-surface-100">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="rounded p-1 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300"
        aria-label="Dismiss toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
