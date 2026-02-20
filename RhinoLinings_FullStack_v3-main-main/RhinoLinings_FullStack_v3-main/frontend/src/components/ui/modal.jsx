// src/components/ui/modal.jsx
import { Button } from "./button";

export const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirm" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rhinoBlack/70 backdrop-blur-sm">
      <div className="bg-rhinoGrey rounded-2xl shadow-xl w-full max-w-md p-6">
        {title && <h2 className="text-xl font-bold text-rhinoYellow mb-4">{title}</h2>}
        <div className="text-rhinoWhite mb-6">{children}</div>

        <div className="flex justify-end space-x-3">
          <Button variant="grey" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};