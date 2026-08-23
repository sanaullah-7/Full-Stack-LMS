import React from "react";
import { Loader2 } from "lucide-react";

export const Spinner = ({ size = "md", text = "Loading...", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-[var(--color-primary)]`} />
      {text && <p className="text-xs text-[var(--color-text-muted)]">{text}</p>}
    </div>
  );
};
