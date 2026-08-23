import { Inbox } from "lucide-react";

/** Lightweight empty state used across list pages */
export default function EmptyState({
  title = "Nothing here yet",
  description = "When data is added, it will show up here.",
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/80 px-6 py-14 text-center shadow-[var(--shadow-sm)] backdrop-blur-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-inner">
        <Icon size={24} strokeWidth={2} />
      </div>
      <p className="text-base font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-[var(--color-text-muted)]">
        {description}
      </p>
    </div>
  );
}
