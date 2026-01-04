import { useState, useCallback } from "react";
import { ToastContext } from "./ToastContext";
import type { ToastType } from "../types/Toast";
import { v4 as uuidv4 } from "uuid";

type Props = {
  children: React.ReactNode;
};

export const ToastProvider = ({ children }: Props) => {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
