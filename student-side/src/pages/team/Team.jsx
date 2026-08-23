import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { teamService } from "../../services/team.service";
import { storage } from "../../utils/storage";
import { showChatComingSoon } from "../../utils/chatAlert";
import { MessageSquare, Loader2 } from "lucide-react";

export const Team = () => {
  const { user } = useAuth();
  const { setPageTitle } = useOutletContext();

  // Instant SWR Cache Hydration
  const [team, setTeam] = useState(() => storage.getCache("team") || null);
  const [loading, setLoading] = useState(() => !storage.getCache("team"));

  useEffect(() => {
    setPageTitle("Team");
    loadTeam();
  }, [setPageTitle]);

  const loadTeam = async () => {
    try {
      if (!storage.getCache("team")) {
        setLoading(true);
      }
      const data = await teamService.getMyTeam();
      setTeam(data);
      if (data) storage.setCache("team", data);
    } catch (err) {
      console.warn("Failed to load team:", err);
    } finally {
      setLoading(false);
    }
  };

  const members = team?.members || [];
  const teamName = team?.name || "Alpha Coders";

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="inner-page active fade-in">
      <div className="page-header-row">
        <div>
          <h1 className="page-headline">{teamName}</h1>
          <p className="page-sub">
            Team · Batch {user?.batch || "11"} · {user?.course || "MERN Stack Development"}
          </p>
        </div>
      </div>

      {loading && members.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      ) : (
        <div className="team-grid">
          {members.length > 0 ? (
            members.map((member) => {
              const isCurrentUser =
                (user?._id && member._id === user._id) ||
                (user?.email && member.email === user.email) ||
                (user?.rollNumber && member.rollNumber === user.rollNumber);

              return (
                <div
                  key={member._id || member.email}
                  className={`team-member-card card ${isCurrentUser ? "you-card" : ""}`}
                >
                  <div className={`tm-avatar ${isCurrentUser ? "you" : ""}`}>
                    {getInitials(member.name)}
                  </div>
                  <div className="tm-info">
                    <span className="tm-name">
                      {member.name}{" "}
                      {isCurrentUser && <span className="you-chip">You</span>}
                    </span>
                    <span className="tm-role">
                      Roll: {member.rollNumber || "--"} · {member.course || "Developer"}
                    </span>
                  </div>
                  <div className="tm-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      title={isCurrentUser ? "Saved Messages" : `Chat with ${member.name}`}
                      onClick={() => showChatComingSoon(isCurrentUser ? "Yourself (Saved Messages)" : member.name)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", gridColumn: "1 / -1" }}>
              No team members assigned yet.
            </div>
          )}
        </div>
      )}

      {/* Team Activity Feed */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header">
          <h3 className="card-title">Team Activity</h3>
        </div>
        <div className="activity-feed">
          <div className="activity-item">
            <div className="activity-avatar">SA</div>
            <div className="activity-body">
              <span className="activity-text"><b>Sana Ullah</b> pushed 3 commits to main branch</span>
              <span className="activity-time">12 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-avatar">BA</div>
            <div className="activity-body">
              <span className="activity-text"><b>Bahadar Ali</b> completed task "Team Page UI Design"</span>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-avatar">SH</div>
            <div className="activity-body">
              <span className="activity-text"><b>Shayan Ahmad</b> opened pull request #14</span>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-avatar you">MJ</div>
            <div className="activity-body">
              <span className="activity-text"><b>You</b> merged pull request #13 — "Attendance API"</span>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
