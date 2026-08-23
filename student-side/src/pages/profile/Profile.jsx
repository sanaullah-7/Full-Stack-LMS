import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useOutletContext } from "react-router-dom";
import { ChangePasswordModal } from "../../components/profile/ChangePasswordModal";
import { attendanceService } from "../../services/attendance.service";
import { tasksService } from "../../services/tasks.service";
import { storage } from "../../utils/storage";
import { Mail, Phone, ExternalLink, Clock, FileCheck, Key } from "lucide-react";

export const Profile = () => {
  const { user, logout } = useAuth();
  const { setPageTitle } = useOutletContext();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  // Instant SWR Cache Hydration
  const [attendanceCount, setAttendanceCount] = useState(() => {
    const cached = storage.getCache("attendance") || [];
    const present = cached.filter((r) => r.status === "Present").length;
    return { present, total: cached.length };
  });

  const [completedTasksCount, setCompletedTasksCount] = useState(() => {
    const cached = storage.getCache("tasks") || [];
    return cached.filter((t) => (t.status || "").toLowerCase() === "completed").length;
  });

  useEffect(() => {
    setPageTitle("Profile");
    loadProfileStats();
  }, [setPageTitle]);

  const loadProfileStats = async () => {
    try {
      const [attRes, tasksRes] = await Promise.allSettled([
        attendanceService.getAttendanceRecords(),
        tasksService.getTasks(),
      ]);

      if (attRes.status === "fulfilled") {
        const raw = attRes.value?.attendance || attRes.value?.data || attRes.value || [];
        const records = Array.isArray(raw) ? raw : [];
        storage.setCache("attendance", records);
        const present = records.filter((r) => r.status === "Present").length;
        setAttendanceCount({ present, total: records.length });
      }

      if (tasksRes.status === "fulfilled" && Array.isArray(tasksRes.value)) {
        storage.setCache("tasks", tasksRes.value);
        const done = tasksRes.value.filter((t) => (t.status || "").toLowerCase() === "completed").length;
        setCompletedTasksCount(done);
      }
    } catch (err) {
      console.warn("Could not load profile metrics:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  const attendanceRatio = attendanceCount.total > 0
    ? `${attendanceCount.present}/${attendanceCount.total}`
    : "0/0";

  const rate = attendanceCount.total > 0
    ? Math.round((attendanceCount.present / attendanceCount.total) * 100)
    : 100;

  return (
    <div className="inner-page active fade-in">
      <div className="profile-cover">
        <div className="profile-cover-smit">
          <img src="/smit-logo.png" alt="SMIT" className="profile-cover-logo" />
        </div>
        <div className="profile-header-row">
          <div className="profile-avatar-lg">{getInitials(user?.name || "Student")}</div>
          <div className="profile-identity">
            <h2 className="profile-name">{user?.name || "Muhammad Junaid"}</h2>
            <p className="profile-meta">
              {user?.course || "MERN Stack Development"} · Batch {user?.batch || "11"} · Roll No. {user?.rollNumber || "100234"}
            </p>
            <p className="profile-meta" style={{ opacity: 0.85, fontSize: "13.5px" }}>
              {user?.email || "student@smitlms.com"} · Active Student
            </p>
          </div>
          <button
            type="button"
            className="profile-cover-action-btn"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <Key className="w-3.5 h-3.5" /> Change Password
          </button>
        </div>
      </div>

      {/* Clean 2-Metric Row */}
      <div className="stat-row lms-stat-grid" style={{ marginBottom: "1.5rem" }}>
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
            <span className="lms-metric-number">{completedTasksCount} Done</span>
            <span className="lms-metric-label">Assignments</span>
          </div>
          <div className="lms-metric-icon-wrap assignment">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
          onClick={() => setActiveTab('academic')}
        >
          Academic
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'about' && (
        <div className="profile-tab active card" style={{ marginTop: "1rem", padding: "1.75rem" }}>
          <div className="about-grid">
            <div>
              <h4 className="about-section-title">Bio</h4>
              <p className="about-bio">
                Full stack developer passionate about building clean, scalable web applications.
                Currently learning {user?.course || "MERN Stack Development"} at Saylani SMIT Bootcamp, Batch {user?.batch || "11"}.
              </p>
            </div>
            <div>
              <h4 className="about-section-title">Contact</h4>
              <div className="contact-list">
                <div className="contact-item">
                  <Mail className="w-4 h-4 text-[var(--accent)]" />
                  {user?.email || "student@smitlms.com"}
                </div>
                <div className="contact-item">
                  <Phone className="w-4 h-4 text-[var(--accent)]" />
                  {user?.phone || "+92-300-1234567"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="about-section-title">Skills</h4>
              <div className="skills-wrap">
                <span className="tag tag-green">Node.js</span>
                <span className="tag tag-green">React</span>
                <span className="tag tag-green">MongoDB</span>
                <span className="tag tag-clay">Express</span>
                <span className="tag tag-clay">REST APIs</span>
                <span className="tag tag-amber">JWT Auth</span>
              </div>
            </div>
            <div>
              <h4 className="about-section-title">Links</h4>
              <div className="contact-list">
                <a href="#" className="contact-item hover:text-[var(--accent)] transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  github.com/DoctorJunaid
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="profile-tab active card" style={{ marginTop: "1rem", padding: "1.75rem" }}>
          <div className="academic-grid">
            <div className="academic-item">
              <span className="academic-label">Course</span>
              <span className="academic-val">{user?.course || "MERN Stack Development"}</span>
            </div>
            <div className="academic-item">
              <span className="academic-label">Batch</span>
              <span className="academic-val">Batch {user?.batch || "11"}</span>
            </div>
            <div className="academic-item">
              <span className="academic-label">Roll Number</span>
              <span className="academic-val font-mono">{user?.rollNumber || "100234"}</span>
            </div>
            <div className="academic-item">
              <span className="academic-label">Overall Attendance</span>
              <span className="academic-val">
                {rate}% —{" "}
                <span className={`tag ${rate >= 75 ? "tag-green" : "tag-clay"}`} style={{ display: "inline" }}>
                  {rate >= 75 ? "Safe" : "Warning"}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="profile-tab active card" style={{ marginTop: "1rem", padding: "1.75rem" }}>
          <div className="settings-list">
            <div className="settings-row">
              <div className="settings-label-group">
                <span className="settings-label">Security & Password</span>
                <span className="settings-desc">Update your student portal login password</span>
              </div>
              <button
                className="btn-outline"
                onClick={() => setIsPasswordModalOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", padding: ".4rem .8rem" }}
              >
                <Key className="w-3.5 h-3.5" /> Change Password
              </button>
            </div>
            <div className="settings-row">
              <div className="settings-label-group">
                <span className="settings-label">Email Notifications</span>
                <span className="settings-desc">Get emailed when tasks are assigned</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-track"><span className="toggle-thumb"></span></span>
              </label>
            </div>
            <div className="settings-row">
              <div className="settings-label-group">
                <span className="settings-label">Attendance Alerts</span>
                <span className="settings-desc">Notify when attendance drops below 80%</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-track"><span className="toggle-thumb"></span></span>
              </label>
            </div>
          </div>

          <div className="danger-zone">
            <button className="danger-link" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
