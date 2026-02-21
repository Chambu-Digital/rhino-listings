// src/components/ui/toast.jsx
import { useEffect } from "react";

export const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: "bg-green-500 text-gray-900",
    error: "bg-red-500 text-gray-900",
    info: "bg-rhinoYellow text-rhinoBlack",
  };

  return (
    <div
      className={`fixed bottom-5 right-5 px-5 py-3 rounded-xl shadow-lg font-semibold ${colors[type]} transition-all`}
    >
      {message}
    </div>
  );
};