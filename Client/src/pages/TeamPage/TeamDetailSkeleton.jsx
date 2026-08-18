import Skeleton from "../../components/ui/Skeleton";

export default function TeamDetailSkeleton() {
  return (
    <div className="flex flex-col gap-md" aria-busy="true">
      {/* Assigned Projects skeleton */}
      <section className="bg-surface rounded-xl border border-border p-md shadow-sm">
        <div className="flex items-center gap-sm mb-sm">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-surface-low border border-border rounded-lg p-md flex flex-col gap-sm"
            >
              <div className="flex justify-between gap-sm">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4 max-w-[180px]" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <Skeleton className="h-4 w-4 shrink-0" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Members skeleton */}
      <section className="bg-surface rounded-xl border border-border p-md shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-md mb-sm">
          <div className="flex items-center gap-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[280px] sm:max-w-[320px] space-y-2">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-surface-low border border-border rounded-lg p-md flex items-center gap-md"
            >
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
