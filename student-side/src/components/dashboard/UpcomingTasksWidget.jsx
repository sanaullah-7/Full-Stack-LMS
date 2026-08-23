import React from "react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { EmptyState } from "../common/EmptyState";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { formatDate } from "../../utils/formatters";
import { BADGE_VARIANTS } from "../../constants/statusTypes";

export const UpcomingTasksWidget = ({ tasks = [] }) => {
  return (
    <Card
      title="Upcoming Tasks"
      subtitle="Deadlines and pending deliverables"
      action={
        <Link
          to="/tasks"
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
        >
          All Tasks <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      {tasks.length === 0 ? (
        <EmptyState
          title="No Pending Tasks"
          description="You are all caught up! Check back later."
        />
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task._id || task.id}
              className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-low)] flex items-center justify-between gap-3 hover:border-[var(--color-primary)]/40 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-[var(--color-text)] truncate">
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-muted)]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
              </div>

              <Badge
                variant={BADGE_VARIANTS[task.status] || "secondary"}
                size="sm"
              >
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
