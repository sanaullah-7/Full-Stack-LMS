import React from "react";

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = "",
}) => {
  return (
    <div
      className={`app-panel p-5 bg-[var(--color-surface)] flex items-start justify-between ${className}`}
    >
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          {title}
        </p>
        <h4 className="text-2xl font-bold text-[var(--color-text)] mt-1.5">
          {value}
        </h4>
        {subtitle && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="mt-2 text-xs font-medium flex items-center gap-1">
            {trend}
          </div>
        )}
      </div>

      {Icon && (
        <div className="app-stat-icon">
          <Icon className="w-5 h-5 text-[var(--color-primary)]" />
        </div>
      )}
    </div>
  );
};
