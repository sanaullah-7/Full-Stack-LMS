

const baseStyles =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
};

const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant] ?? variantStyles.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
