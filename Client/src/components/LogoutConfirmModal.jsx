import { LogOut, X } from "lucide-react";

/**
 * Professional logout confirmation — desktop & mobile.
 * Uses explicit sizes (avoid max-w-sm / gap-* collisions with design tokens).
 */
export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-[var(--spacing-md)]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        className="relative w-full max-w-[360px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--spacing-lg)] shadow-[var(--shadow-md)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[var(--spacing-md)] top-[var(--spacing-md)] cursor-pointer rounded-[var(--radius-lg)] p-[var(--spacing-sm)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-low)] hover:text-[var(--color-text)]"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="flex flex-col items-center text-center pr-[var(--spacing-md)]">
          <div className="mb-[var(--spacing-md)] flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-error)]/10 text-[var(--color-error)]">
            <LogOut size={22} strokeWidth={2} />
          </div>

          <h2
            id="logout-confirm-title"
            className="mb-[var(--spacing-sm)] text-[16px] font-semibold leading-snug text-[var(--color-text)]"
          >
            Confirm logout
          </h2>

          <p className="mb-[var(--spacing-lg)] text-[14px] leading-relaxed text-[var(--color-text-muted)]">
            Are you sure you want to log out of Bootcamp LMS?
          </p>
        </div>

        <div className="flex flex-col gap-[var(--spacing-sm)] sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--spacing-md)] py-[10px] text-[14px] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-low)] sm:w-auto sm:min-w-[100px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full cursor-pointer rounded-[var(--radius-lg)] bg-[var(--color-error)] px-[var(--spacing-md)] py-[10px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 sm:w-auto sm:min-w-[100px]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
