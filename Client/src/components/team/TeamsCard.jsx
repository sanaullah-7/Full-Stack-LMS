import { CalendarDays, FolderKanban, UsersRound, ArrowRight } from "lucide-react";
import { getTeamProjects } from "./deriveTeamStatus";

function formatDeadline(isoDate) {
  if (!isoDate) return "No deadline";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return String(isoDate);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function MemberAvatars({ members = [], totalCount }) {
  const visible = members.slice(0, 4);
  const extra = Math.max(totalCount - visible.length, 0);

  if (totalCount === 0) {
    return (
      <p className="text-[13px] text-[var(--color-text-muted)]">No members yet</p>
    );
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex -space-x-2">
        {visible.map((member, index) => {
          const label = member?.name || member?.email || `M${index + 1}`;
          return (
            <span
              key={member?._id || member?.id || `${label}-${index}`}
              title={label}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-primary)] text-[10px] font-semibold text-[var(--color-on-primary)]"
            >
              {getInitials(label)}
            </span>
          );
        })}
        {extra > 0 && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-surface-high)] text-[10px] font-semibold text-[var(--color-text-muted)]">
            +{extra}
          </span>
        )}
      </div>
      <p className="truncate text-[13px] text-[var(--color-text-muted)]">
        {totalCount} {totalCount === 1 ? "member" : "members"}
      </p>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        <Icon size={15} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          {label}
        </p>
        <p
          className="truncate text-[14px] font-semibold leading-snug text-[var(--color-text)]"
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function TeamCard({ team, onViewTeam }) {
  const { id, _id, name, memberCount, members = [] } = team;
  const teamId = _id || id;
  const count = memberCount ?? members.length ?? 0;
  const teamProjects = getTeamProjects(team);
  const displayProject = teamProjects[0] ?? null;
  const projectTitle = displayProject?.title || "No project assigned";
  const deadline = formatDeadline(
    displayProject?.dueDate || displayProject?.deadline,
  );

  return (
    <article className="group relative flex h-full min-w-[260px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-normal)] hover:-translate-y-1 hover:border-[var(--color-primary)]/35 hover:shadow-[var(--shadow-md)]">
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)]" aria-hidden />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-primary)] text-[14px] font-bold text-[var(--color-on-primary)] shadow-sm">
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Team
            </p>
            <h3
              className="truncate text-[17px] font-bold leading-tight text-[var(--color-text)]"
              title={name}
            >
              {name}
            </h3>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <MetaRow icon={FolderKanban} label="Project" value={projectTitle} />
          <MetaRow icon={CalendarDays} label="Deadline" value={deadline} />
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <UsersRound size={15} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                Members
              </p>
              <MemberAvatars members={members} totalCount={count} />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => onViewTeam?.(teamId)}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-4 py-2.5 text-[14px] font-medium text-[var(--color-on-primary)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-on-primary-container)]"
          >
            View team
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
