// src/components/ui/select.jsx
export const Select = ({ options = [], value, onChange, className = "", ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rhinoYellow text-rhinoBlack ${className}`}
    {...props}
  >
    <option value="">-- Select --</option>
    {options.map((opt) => (
      <option key={opt.value || opt} value={opt.value || opt}>
        {opt.label || opt}
      </option>
    ))}
  </select>
);