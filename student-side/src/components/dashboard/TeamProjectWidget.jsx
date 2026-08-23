import React from "react";
import { Card } from "../common/Card";
import { Avatar } from "../common/Avatar";
import { Link } from "react-router-dom";
import { Users, ExternalLink } from "lucide-react";

export const TeamProjectWidget = ({ team }) => {
  return (
    <Card
      title="Team & Capstone Project"
      subtitle={team?.teamName || "Assigned Team Workspace"}
      action={
        <Link
          to="/team"
          className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
        >
          Team Space <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="space-y-4">
        {team?.projectId ? (
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text)]">
              {team.projectId.title || "Capstone Project"}
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-1">
              {team.projectId.description || "No project description available."}
            </p>
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-muted)]">
            Capstone project assignments will be announced by your instructor soon.
          </p>
        )}

        {/* Team Members */}
        {team?.members && team.members.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Team Members ({team.members.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {team.members.map((member) => (
                <div
                  key={member._id || member.id}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--color-surface-low)] border border-[var(--color-border-subtle)] text-xs"
                >
                  <Avatar src={member.avatar} name={member.name} size="sm" />
                  <span className="font-medium text-[var(--color-text)]">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
