// src/components/ui/spinner.jsx
export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={`${sizes[size]} border-rhinoYellow border-t-transparent rounded-full animate-spin ${className}`}
    ></div>
  );
};