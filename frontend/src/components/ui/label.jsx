// src/components/ui/label.jsx
export const Label = ({ children, className = "", ...props }) => (
  <label className={`block text-sm font-medium text-rhinoWhite mb-1 ${className}`} {...props}>
    {children}
  </label>
);