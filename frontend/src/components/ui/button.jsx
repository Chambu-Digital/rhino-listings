// src/components/ui/button.jsx
export const Button = ({ children, className = "", variant = "default", ...props }) => {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2";

  const variants = {
    default: "bg-rhinoYellow text-rhinoBlack hover:bg-yellow-400 focus:ring-rhinoYellow",
    dark: "bg-rhinoBlack text-rhinoWhite hover:bg-gray-900 focus:ring-gray-700",
    grey: "bg-rhinoGrey text-rhinoWhite hover:bg-gray-700 focus:ring-gray-600",
    outline: "border border-rhinoYellow text-rhinoYellow hover:bg-yellow-100 focus:ring-rhinoYellow",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};