import React, { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { tasksService } from "../../services/tasks.service";
import { attendanceService } from "../../services/attendance.service";
import { teamService } from "../../services/team.service";
import { storage } from "../../utils/storage";
import { Clock, FileCheck, FileText, Calendar, FolderKanban, Users } from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();
  const { setPageTitle } = useOutletContext();

  // Instant SWR Cache Hydration
  const [upcomingTasks, setUpcomingTasks] = useState(() => {
    const cached = storage.getCache("tasks") || [];
    return cached
      .filter((t) => (t.status || "").toLowerCase() !== "completed")
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
  });
  const [loadingTasks, setLoadingTasks] = useState(() => !storage.getCache("tasks"));

  const [attendanceCount, setAttendanceCount] = useState(() => {
    const cached = storage.getCache("attendance") || [];
    const present = cached.filter((r) => r.status === "Present").length;
    return { present, total: cached.length };
  });

  const [taskStats, setTaskStats] = useState(() => {
    const cached = storage.getCache("tasks") || [];
    const completed = cached.filter((t) => (t.status || "").toLowerCase() === "completed").length;
    return { completed, total: cached.length };
  });

  const [teamData, setTeamData] = useState(() => storage.getCache("team") || null);

  useEffect(() => {
    setPageTitle("Dashboard");
    loadDashboardData();
  }, [setPageTitle]);

  const loadDashboardData = async () => {
    try {
      const [tasksRes, attendanceRes, teamRes] = await Promise.allSettled([
        tasksService.getTasks(),
        attendanceService.getAttendanceRecords(),
        teamService.getMyTeam(),
      ]);

      if (tasksRes.status === "fulfilled" && Array.isArray(tasksRes.value)) {
        const allTasks = tasksRes.value;
        storage.setCache("tasks", allTasks);
        const pending = allTasks
          .filter((t) => (t.status || "").toLowerCase() !== "completed")
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 3);
        setUpcomingTasks(pending);
        const completed = allTasks.filter((t) => (t.status || "").toLowerCase() === "completed").length;
        setTaskStats({ completed, total: allTasks.length });
      }

      if (attendanceRes.status === "fulfilled") {
        const raw = attendanceRes.value?.attendance || attendanceRes.value?.data || attendanceRes.value || [];
        const records = Array.isArray(raw) ? raw : [];
        storage.setCache("attendance", records);
        const present = records.filter((r) => r.status === "Present").length;
        setAttendanceCount({ present, total: records.length });
      }

      if (teamRes.status === "fulfilled" && teamRes.value) {
        setTeamData(teamRes.value);
        storage.setCache("team", teamRes.value);
      }
    } catch (err) {
      console.warn("Could not load dashboard data:", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const attendanceRatio = attendanceCount.total > 0
    ? `${attendanceCount.present}/${attendanceCount.total}`
    : "0/0";

  const taskRatio = taskStats.total > 0
    ? `${taskStats.completed}/${taskStats.total}`
    : `${taskStats.completed}/0`;

  return (
    <div className="inner-page active fade-in">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <p className="welcome-greeting">Good morning, Student</p>
          <h1 className="welcome-name">{user?.name || "Muhammad Junaid"}</h1>
          <p className="welcome-summary">
            Batch {user?.batch || "11"} · {user?.course || "MERN Stack Development"} · Roll No. <span className="mono-inline">{user?.rollNumber || "100234"}</span>
          </p>
        </div>
        <div className="welcome-meta">
          <div className="welcome-date">
            <span className="welcome-day">{new Date().getDate()}</span>
            <span className="welcome-date-text">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short' })}
            </span>
          </div>
          <div className="welcome-tags">
            <span className="wtag">{user?.course || "MERN Stack"}</span>
            <span className="wtag">Batch {user?.batch || "11"}</span>
          </div>
        </div>
      </div>

      {/* Clean Stat Metrics: Attendance & Assignment */}
      <div className="stat-row lms-stat-grid">
        <div className="stat-card lms-metric-card">
          <div className="lms-metric-info">
            <span className="lms-metric-number">{attendanceRatio}</span>
            <span className="lms-metric-label">Attendance</span>
          </div>
          <div className="lms-metric-icon-wrap clock">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="stat-card lms-metric-card">
          <div className="lms-metric-info">
            <span className="lms-metric-number">{taskRatio}</span>
            <span className="lms-metric-label">Assignment</span>
          </div>
          <div className="lms-metric-icon-wrap assignment">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two-Column Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-col-main">
          {/* Upcoming Tasks */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Upcoming Tasks</h3>
              <Link to="/tasks" className="card-link">View all →</Link>
            </div>
            <div className="task-checklist">
              {loadingTasks && upcomingTasks.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>Loading tasks...</div>
              ) : upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <div className="task-row" key={task._id}>
                    <div className="task-info">
                      <span className="task-name">{task.title}</span>
                      <div className="task-meta">
                        <span className={`tag tag-${(task.status || '').toLowerCase() === 'completed' ? 'green' : 'amber'}`}>
                          {task.status || 'Pending'}
                        </span>
                        <span className="task-due">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No upcoming tasks.</div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-col-side">
          {/* Team Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Team Roster</h3>
              <Link to="/team" className="card-link">View Hub →</Link>
            </div>
            <div className="activity-feed">
              {teamData?.members && teamData.members.length > 0 ? (
                teamData.members.slice(0, 3).map((member) => (
                  <div className="activity-item" key={member._id || member.email}>
                    <div className="activity-avatar">
                      {(member.name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="activity-body">
                      <span className="activity-text"><b>{member.name}</b></span>
                      <span className="activity-time">{member.rollNumber || member.email}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                  Team: {teamData?.name || "Alpha Coders"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/tasks" className="quick-pill" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FileText className="w-3.5 h-3.5" /> View Assignments
        </Link>
        <Link to="/attendance" className="quick-pill" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Calendar className="w-3.5 h-3.5" /> My Attendance
        </Link>
        <Link to="/project" className="quick-pill" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FolderKanban className="w-3.5 h-3.5" /> Active Projects
        </Link>
        <Link to="/team" className="quick-pill" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Users className="w-3.5 h-3.5" /> Team Hub
        </Link>
      </div>
    </div>
  );
};
