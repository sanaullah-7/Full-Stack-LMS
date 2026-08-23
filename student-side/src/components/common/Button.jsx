import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable Design-System Button
 * @param {'primary' | 'outline' | 'ghost' | 'sso'} variant
 * @param {'sm' | 'md' | 'lg'} size
 */
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) => {
  let variantClass = "";
  if (variant === "primary") variantClass = "btn-primary";
  else if (variant === "outline" || variant === "secondary") variantClass = "btn-outline";
  else if (variant === "sso") variantClass = "btn-sso";
  else if (variant === "ghost") variantClass = "text-muted hover:text-[var(--text)] transition-colors";

  let sizeClass = "";
  if (size === "sm") sizeClass = "text-xs py-1 px-2";
  else if (size === "lg") sizeClass = "text-base py-2.5 px-5";
  else if (variant === "primary") sizeClass = ""; // Use default btn-primary sizing

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${variantClass} ${sizeClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
};
