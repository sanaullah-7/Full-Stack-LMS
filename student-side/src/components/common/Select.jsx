import React, { forwardRef } from "react";

export const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-[var(--color-surface)] border ${
            error
              ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
              : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
          } rounded-lg px-3.5 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-4 transition-all duration-200 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
