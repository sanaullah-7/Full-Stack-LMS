import React, { forwardRef } from "react";

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      className = "",
      containerClassName = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`form-field ${containerClassName}`}>
        {label && (
          <label className="field-label">
            {label}
          </label>
        )}
        <div className={type === "password" || Icon ? "field-password-wrap relative" : ""}>
          {Icon && type !== "password" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`field-input ${Icon && type !== "password" ? "!pl-9" : ""} ${error ? "!border-[var(--danger)]" : ""} ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>
        ) : (
          helperText && (
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {helperText}
            </p>
          )
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
