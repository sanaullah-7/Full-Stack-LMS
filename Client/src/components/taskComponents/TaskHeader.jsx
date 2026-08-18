import { useState } from "react";
import { LuList, LuCalendar, LuPlus } from "react-icons/lu";

const TaskHeader = ({ onCreateClick }) => {
  const [view, setView] = useState("list");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-lg">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Tasks & Assignments
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-xs">
          Manage curriculum updates and cohort tasks.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle View */}
        <div className="flex items-center bg-[var(--color-surface-low)] rounded-lg p-1 border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-all ${
              view === "list"
                ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <LuList className="h-4 w-4" />
            List
          </button>
          <button
            type="button"
            onClick={() => setView("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md cursor-pointer transition-all ${
              view === "timeline"
                ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <LuCalendar className="h-4 w-4" />
            Timeline
          </button>
        </div>

        {/* New Task Button */}
        <button
          type="button"
          onClick={onCreateClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90 shadow-[var(--shadow-sm)] cursor-pointer transition-all"
        >
          <LuPlus className="h-4 w-4" />
          New Task
        </button>
      </div>
    </div>
  );
};

export default TaskHeader;
