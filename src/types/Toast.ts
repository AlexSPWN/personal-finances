export type ToastType = "info" | "success" | "error";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};