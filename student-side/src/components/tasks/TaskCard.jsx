import React from "react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Clock, CheckCircle2, Upload, ExternalLink } from "lucide-react";
import { formatDate } from "../../utils/formatters";
import { BADGE_VARIANTS } from "../../constants/statusTypes";

export const TaskCard = ({ task, onSubmitClick }) => {
  const isSubmitted =
    task.status === "submitted" || task.status === "completed";

  return (
    <div className="app-panel p-5 bg-[var(--color-surface)] flex flex-col justify-between hover:border-[var(--color-primary)]/40 transition-all">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <Badge
            variant={BADGE_VARIANTS[task.status] || "secondary"}
            size="sm"
          >
            {task.status}
          </Badge>
          <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(task.dueDate)}
          </span>
        </div>

        <h4 className="text-base font-semibold text-[var(--color-text)] line-clamp-1">
          {task.title}
        </h4>
        <p className="text-xs text-[var(--color-text-muted)] line-clamp-3 mt-1.5 leading-relaxed">
          {task.description || "No specific instructions provided for this assignment."}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
        {task.submissionUrl ? (
          <a
            href={task.submissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 font-medium"
          >
            View My Submission <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)]">
            Not Submitted
          </span>
        )}

        <Button
          variant={isSubmitted ? "outline" : "primary"}
          size="sm"
          onClick={() => onSubmitClick(task)}
          icon={isSubmitted ? CheckCircle2 : Upload}
        >
          {isSubmitted ? "Update Submission" : "Submit Work"}
        </Button>
      </div>
    </div>
  );
};
