import Skeleton from "../ui/Skeleton";

export default function TeamCardSkeleton() {
  return (
    <div className="min-w-[260px] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <div className="h-1.5 w-full bg-[var(--color-surface-high)]" />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-[var(--radius-xl)] shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-5 w-36" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-[var(--radius-lg)] shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-2.5 w-14" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          ))}
        </div>

        <Skeleton className="mt-4 h-10 w-full rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
}
