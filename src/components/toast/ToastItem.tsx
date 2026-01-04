import { useContext } from "react";
import { ToastContext } from "../../context/ToastContext";

type Props = {
  id: string;
  message: string;
  type: "info" | "success" | "error";
};

export const ToastItem = ({ id, message, type }: Props) => {
  const { removeToast } = useContext(ToastContext);

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded shadow mb-2 cursor-pointer`}
      onClick={() => removeToast(id)}
    >
      {message}
    </div>
  );
};