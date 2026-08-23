import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { notificationService } from "../../services/notification.service";
import { storage } from "../../utils/storage";
import { Bell, CheckCircle2, Info, BookOpen, MessageSquare } from "lucide-react";
import { showChatComingSoon } from "../../utils/chatAlert";

export const StudentHeader = ({ title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);

  // Instant SWR Cache Hydration
  const [notifs, setNotifs] = useState(() => storage.getCache("notifications") || []);
  const dropdownRef = useRef(null);

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      if (Array.isArray(data)) {
        setNotifs(data);
        storage.setCache("notifications", data);
      }
    } catch (err) {
      console.warn("Failed to load notifications:", err);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifs]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      const updated = notifs.map((n) => ({ ...n, read: true }));
      setNotifs(updated);
      storage.setCache("notifications", updated);
    } catch (err) {
      console.warn("Failed to mark all as read:", err);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "TASK":
      case "task":
        return <BookOpen className="w-4 h-4 text-accent" />;
      case "GRADE":
      case "grade":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      default:
        return <Info className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <h2 className="topbar-title">{title}</h2>

        <div className="topbar-actions">
          {/* Chat Icon (Coming Soon) */}
          <button
            type="button"
            className="topbar-icon-btn"
            aria-label="Messages & Chat"
            title="Messages (Coming Soon)"
            onClick={() => showChatComingSoon()}
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Notifications Wrapper */}
          <div className="relative" ref={dropdownRef} style={{ position: "relative" }}>
            <button
              className="topbar-icon-btn"
              aria-label="Notifications"
              onClick={() => setShowNotifs(!showNotifs)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="notif-dot"></span>}
            </button>

            {showNotifs && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="notif-clear-btn" onClick={handleMarkAllRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notif-body">
                  {notifs.length === 0 ? (
                    <div className="notif-empty">You're all caught up!</div>
                  ) : (
                    notifs.map((n) => (
                      <div key={n._id || n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
                        <div className="notif-icon-wrap">{getIconForType(n.type)}</div>
                        <div className="notif-content">
                          <div className="notif-item-title">
                            {!n.read && <span className="unread-dot"></span>}
                            {n.title}
                          </div>
                          <div className="notif-item-desc">{n.message || n.desc}</div>
                          <div className="notif-item-time">
                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now"}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="hidden sm:block"
            style={{
              fontSize: "12px",
              background: "var(--bg)",
              padding: ".2rem .6rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            Batch {user?.batch || "11"}
          </div>
          <button
            type="button"
            className="topbar-avatar"
            aria-label="Go to profile"
            onClick={() => navigate("/profile")}
          >
            {getInitials(user?.name)}
          </button>
        </div>
      </div>
    </header>
  );
};
