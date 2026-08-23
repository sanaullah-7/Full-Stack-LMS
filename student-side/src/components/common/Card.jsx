import React from "react";

export const Card = ({
  children,
  className = "",
  title,
  subtitle,
  badge,
  action,
  headerClassName = "",
  bodyClassName = "",
  ...props
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || action || badge) && (
        <div className={`card-header ${headerClassName}`}>
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {badge && <span className="card-badge">{badge}</span>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};
