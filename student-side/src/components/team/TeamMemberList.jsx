import React from "react";
import { Avatar } from "../common/Avatar";
import { Badge } from "../common/Badge";
import { Mail, MessageSquare } from "lucide-react";
import { showChatComingSoon } from "../../utils/chatAlert";

export const TeamMemberList = ({ members = [] }) => {
  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member._id || member.id}
          className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-low)] flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar src={member.avatar} name={member.name} size="md" />
            <div className="truncate">
              <h4 className="text-sm font-semibold text-[var(--color-text)] truncate">
                {member.name}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] font-mono">
                {member.rollNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showChatComingSoon(member.name)}
              className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-container)] hover:text-[var(--accent)] transition-colors"
              title={`Chat with ${member.name} (Coming Soon)`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-container)] transition-colors"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            <Badge variant="primary" size="sm">
              Member
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

