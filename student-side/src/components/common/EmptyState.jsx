import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No Data Found",
  description = "There are no records available to display at this moment.",
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface-low)]/50 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-text-muted)] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-semibold text-[var(--color-text)]">
        {title}
      </h4>
      <p className="text-sm text-[var(--color-text-muted)] max-w-sm mt-1 mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
