/**
 * Consistent page wrapper for all authenticated LMS pages (not login).
 */
export default function PageShell({ children, className = "", narrow = false }) {
  return (
    <div className={`min-h-full p-3 sm:p-5 lg:p-6 ${className}`.trim()}>
      <div
        className={`mx-auto flex w-full flex-col gap-4 ${
          narrow ? "max-w-[var(--container)]" : "max-w-[1400px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function PagePanel({ children, className = "", padded = true }) {
  return (
    <div
      className={`app-panel ${padded ? "p-4 sm:p-5" : "overflow-hidden"} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
