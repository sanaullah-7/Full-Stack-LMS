/**
 * Base skeleton pulse block. Reuse for page-specific loading UIs.
 */
export default function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded bg-[var(--color-surface-high)] ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}
