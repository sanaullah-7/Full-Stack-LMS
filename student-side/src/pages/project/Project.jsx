import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { teamService } from "../../services/team.service";
import { storage } from "../../utils/storage";
import { showChatComingSoon } from "../../utils/chatAlert";
import { Loader2, MessageSquare } from "lucide-react";

export const Project = () => {
  const { setPageTitle } = useOutletContext();

  // Instant SWR Cache Hydration
  const [projects, setProjects] = useState(() => storage.getCache("projects") || []);
  const [team, setTeam] = useState(() => storage.getCache("team") || null);
  const [loading, setLoading] = useState(() => !storage.getCache("projects"));

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("overview");

  useEffect(() => {
    setPageTitle("Projects");
    loadProjectData();
  }, [setPageTitle]);

  const loadProjectData = async () => {
    try {
      if (!storage.getCache("projects")) {
        setLoading(true);
      }
      const [projList, teamData] = await Promise.all([
        teamService.getMyProjects(),
        teamService.getMyTeam(),
      ]);
      const list = Array.isArray(projList) ? projList : [];
      setProjects(list);
      setTeam(teamData);
      storage.setCache("projects", list);
      if (teamData) storage.setCache("team", teamData);
    } catch (err) {
      console.warn("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setActiveDetailTab("overview");
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  const teamMembers = (team?.members || []).map((m) => ({
    name: m.name,
    init: (m.name || "U")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  }));

  // ─── PROJECT DETAIL VIEW (inline, replaces the grid) ───
  if (selectedProject) {
    const progress = selectedProject.progress || 65;
    return (
      <div className="inner-page active fade-in">
        <button className="back-btn" onClick={handleBack}>
          ← Back to Projects
        </button>

        <div className="project-detail-header">
          <div>
            <h2 className="project-detail-title">{selectedProject.title}</h2>
            <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginTop: ".5rem" }}>
              <span className="tag tag-green">MERN Stack</span>
              <span className="tag tag-amber">{selectedProject.status || "In Progress"}</span>
            </div>
          </div>
        </div>

        <div className="project-detail-progress">
          <span className="pd-pct-label">{progress}% complete</span>
          <div className="progress-bar-wrap" style={{ marginTop: ".5rem" }}>
            <div className="progress-bar" style={{ "--pct": `${progress}%` }}></div>
          </div>
        </div>

        <div className="tab-bar" style={{ marginTop: "1.5rem" }}>
          <button
            className={`tab-btn ${activeDetailTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveDetailTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeDetailTab === "team" ? "active" : ""}`}
            onClick={() => setActiveDetailTab("team")}
          >
            Team
          </button>
          <button
            className={`tab-btn ${activeDetailTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveDetailTab("activity")}
          >
            Activity
          </button>
        </div>

        {/* Overview Tab */}
        {activeDetailTab === "overview" && (
          <div className="card" style={{ marginTop: "1rem", padding: "1.75rem" }}>
            <p className="detail-desc">
              {selectedProject.description ||
                "Full-stack Learning Management System built for Saylani SMIT bootcamp. Includes student registration, attendance tracking, team formation, task assignment, and project monitoring."}
            </p>

            <div className="detail-dates">
              <div className="detail-date-item">
                <span className="detail-date-label">Due Date</span>
                <span className="detail-date-val">
                  {selectedProject.dueDate
                    ? new Date(selectedProject.dueDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBD"}
                </span>
              </div>
              <div className="detail-date-item">
                <span className="detail-date-label">Team</span>
                <span className="detail-date-val">{team?.name || "Alpha Coders"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeDetailTab === "team" && (
          <div className="card" style={{ marginTop: "1rem", padding: "1.75rem" }}>
            <div className="team-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {teamMembers.map((member, idx) => (
                <div key={idx} className="team-member-card card" style={{ padding: "1.25rem" }}>
                  <div className="tm-avatar">{member.init}</div>
                  <div className="tm-info">
                    <span className="tm-name">{member.name}</span>
                  </div>
                  <div className="tm-actions" style={{ marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      className="icon-btn"
                      title={`Chat with ${member.name}`}
                      onClick={() => showChatComingSoon(member.name)}
                    >
                      <MessageSquare size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeDetailTab === "activity" && (
          <div className="card" style={{ marginTop: "1rem", padding: "1.75rem" }}>
            <div className="activity-feed" style={{ padding: 0 }}>
              <div className="activity-item">
                <div className="activity-avatar">MJ</div>
                <div className="activity-body">
                  <span className="activity-text">
                    <b>Muhammad Junaid</b> updated project progress to {progress}%
                  </span>
                  <span className="activity-time">Today</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">SA</div>
                <div className="activity-body">
                  <span className="activity-text">
                    <b>Sana Ullah</b> completed milestone "Backend API Architecture"
                  </span>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── PROJECT GRID VIEW (default) ───
  return (
    <div className="inner-page active fade-in">
      <div className="page-header-row">
        <div>
          <h1 className="page-headline">Projects</h1>
          <p className="page-sub">Track, build, and ship together</p>
        </div>
      </div>

      {loading && projects.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      ) : projects.length > 0 ? (
        <div className="project-grid">
          {projects.map((project) => {
            const progress = project.progress || 65;
            return (
              <div
                key={project._id}
                className="project-card card"
                onClick={() => handleCardClick(project)}
              >
                <div className="project-card-top">
                  <div>
                    <span className="tag tag-green">{project.status || "In Progress"}</span>
                    <h3 className="project-card-title">{project.title}</h3>
                    <p className="project-card-desc">{project.description}</p>
                  </div>
                </div>
                <div className="project-card-bottom" style={{ marginTop: "1rem" }}>
                  <div className="avatar-stack">
                    {teamMembers.slice(0, 4).map((member, idx) => (
                      <div key={idx} className="avatar xs stack-av" title={member.name}>
                        {member.init}
                      </div>
                    ))}
                  </div>
                  <span className="project-due">
                    Due {project.dueDate ? new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          No active projects assigned to your team yet.
        </div>
      )}
    </div>
  );
};
