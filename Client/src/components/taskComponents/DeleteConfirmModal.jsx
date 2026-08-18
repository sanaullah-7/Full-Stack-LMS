import { LuCircleAlert, LuX } from "react-icons/lu";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  count,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => !isDeleting && onClose()}
    >
      <div
        className="bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] w-full max-w-[220px] p-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <LuCircleAlert className="h-4 w-4 text-[var(--color-error)] shrink-0" />
            <p className="text-sm text-[var(--color-text)]">
              Delete {count} task{count !== 1 ? "s" : ""}?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close"
            className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded cursor-pointer disabled:opacity-50"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>

        <div className="flex justify-end gap-sm">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-md py-1.5 rounded-lg text-sm font-medium text-text-muted bg-surface-container hover:bg-surface-high cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-md py-1.5 rounded-lg text-sm font-medium text-white bg-error hover:opacity-90 cursor-pointer disabled:opacity-60"
          >
            {isDeleting ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
