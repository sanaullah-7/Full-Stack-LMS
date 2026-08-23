import React from "react";

export const Badge = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const variantStyles = {
    primary: "tag-clay",
    success: "tag-green",
    warning: "tag-amber",
    error: "tag-amber", // There isn't an explicit tag-error in student-portal, so amber
    info: "tag-done",
    secondary: "tag-done",
  };

  return (
    <span
      className={`tag ${variantStyles[variant] || "tag-done"} ${className}`}
    >
      {children}
    </span>
  );
};
