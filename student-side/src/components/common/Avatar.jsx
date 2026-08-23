import React from "react";
import { getInitials } from "../../utils/formatters";

export const Avatar = ({
  src,
  name = "Student",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-[var(--color-border)] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[var(--color-primary-muted)] text-[var(--color-primary)] font-bold flex items-center justify-center border border-[var(--color-primary)]/20 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
