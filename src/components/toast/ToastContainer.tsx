import { useContext } from "react";
import { ToastContext } from "../../context/ToastContext";
import { ToastItem } from "./ToastItem";

export const ToastContainer = () => {
  const { toasts } = useContext(ToastContext);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  );
};