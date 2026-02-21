// src/components/ui/textarea.jsx
export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rhinoYellow text-rhinoBlack ${className}`}
    {...props}
  />
);