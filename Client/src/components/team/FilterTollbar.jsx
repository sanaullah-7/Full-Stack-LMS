import {
  Search,
  Users,
  CircleDashed,
  Loader,
  Eye,
  CheckCircle2,
} from "lucide-react";
import StatusFilterCards from "./StatusFilterCards";

/**
 * FilterToolbar
 * ---------------------------------------------------------------
 * Status filter cards on top, always-visible search bar below.
 *
 * NOTE: Do not use max-w-md / max-w-sm here — in this project's
 * Tailwind theme those map to --spacing-md (16px) / --spacing-sm (8px).
 */

const DEFAULT_FILTERS = [
  {
    key: "all",
    label: "All Teams",
    icon: Users,
    tone: "text-[var(--color-primary)]",
  },
  {
    key: "not_started",
    label: "Not Started",
    icon: CircleDashed,
    tone: "text-[var(--color-text-muted)]",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: Loader,
    tone: "text-[var(--color-warning)]",
  },
  {
    key: "under_review",
    label: "Under Review",
    icon: Eye,
    tone: "text-[var(--color-secondary)]",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    tone: "text-[var(--color-success)]",
  },
];

export default function FilterToolbar({
  filters = DEFAULT_FILTERS,
  counts,
  activeFilter,
  onFilterChange,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  isLoading = false,
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <StatusFilterCards
        filters={filters}
        counts={counts}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        isLoading={isLoading}
      />

      {/* Full-width search — always typeable */}
      <div className="relative w-full max-w-[28rem]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] flex items-center pl-3.5">
          <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
        </div>
        <input
          type="text"
          value={searchQuery ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          autoComplete="off"
          className="relative z-0 block w-full min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-11 pr-3 text-sm text-[var(--color-text)] shadow-[var(--shadow-sm)] placeholder:text-[var(--color-text-muted)] transition-all focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </div>
    </div>
  );
}
