function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function MemberCard({ member, onRemove }) {
  // member might be from mock (has role, email) or real backend (has course, rollNumber)
  const name = member.name || "Unknown";
  const line1 = member.role || member.course || "No Role";
  const line2 = member.email || member.rollNumber || "No Email/RollNo";

  return (
    <div className="bg-surface-low border border-border rounded-lg p-md flex items-center justify-between gap-md relative group hover:border-primary/50 transition-colors min-w-0 overflow-hidden">
      <div className="flex items-center gap-md min-w-0 flex-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container text-on-primary-container text-sm font-weight-semibold shrink-0">
          {getInitials(name)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-weight-semibold text-text truncate">
            {name}
          </p>
          <p className="text-xs text-text-muted truncate">{line1}</p>
          <p className="text-xs text-text-muted truncate">{line2}</p>
        </div>
      </div>
      
      {onRemove && (
        <button 
          type="button"
          onClick={() => onRemove(member._id || member.id)}
          className="text-error hover:bg-error/10 p-sm rounded-md shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          title="Remove member"
          aria-label="Remove member"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      )}
    </div>
  );
}