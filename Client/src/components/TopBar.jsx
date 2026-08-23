import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Moon, Plus, Sun } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import { useTheme } from "../hooks/useTheme";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../Services/notification.services";

const POLL_MS = 60_000;

export default function TopBar({
  title,
  subtitle,
  showNotification = true,
  onNotificationClick,
  showButton = false,
  buttonText = "Add",
  buttonIcon: ButtonIcon = Plus,
  onButtonClick,
  onMenuClick,
}) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showPanel, setShowPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const data = await fetchUnreadNotificationCount();
      setUnreadCount(Number(data?.unreadCount) || 0);
    } catch {
      // Keep navbar usable if notifications API fails
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data?.data) ? data.data : []);
      setUnreadCount(Number(data?.unreadCount) || 0);
    } catch {
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showNotification) return undefined;
    refreshUnreadCount();
    const timer = setInterval(refreshUnreadCount, POLL_MS);
    return () => clearInterval(timer);
  }, [showNotification, refreshUnreadCount]);

  const handleBellClick = async () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
    const next = !showPanel;
    setShowPanel(next);
    if (next) {
      await loadNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications([]);
      setUnreadCount(0);
      setShowPanel(false);
    } catch {
      setError("Failed to mark all as read");
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read && notif._id) {
        await markNotificationAsRead(notif._id);
        setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch {
      // Still allow navigation
    }

    setShowPanel(false);
    if (notif.href) {
      navigate(notif.href);
    }
  };

  const iconBtnClass =
    "relative cursor-pointer rounded-lg bg-primary p-2.5 text-on-primary shadow-sm transition-all duration-200 hover:bg-on-primary-container hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2";

  return (
    <header className="relative flex h-[var(--app-header-height)] shrink-0 items-center justify-between gap-3 border-b border-border bg-surface/90 px-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md sm:px-4 lg:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/35 to-transparent"
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="cursor-pointer shrink-0 rounded-lg border border-border p-2 text-text-muted transition-colors hover:bg-surface-low hover:text-text lg:hidden"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-text sm:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 hidden truncate text-sm font-normal leading-tight text-text-muted sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
          className={iconBtnClass}
        >
          {isDark ? (
            <Sun size={20} strokeWidth={2} />
          ) : (
            <Moon size={20} strokeWidth={2} />
          )}
        </button>

        {showNotification && (
          <div className="relative">
            <button
              type="button"
              onClick={handleBellClick}
              aria-label="Notifications"
              className={iconBtnClass}
            >
              <Bell size={20} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showPanel && (
              <NotificationPanel
                notifications={notifications}
                loading={loading}
                error={error}
                onClose={() => setShowPanel(false)}
                onMarkAllRead={handleMarkAllRead}
                onNotificationClick={handleNotificationClick}
              />
            )}
          </div>
        )}

        {showButton && (
          <button
            type="button"
            onClick={onButtonClick}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all duration-200 hover:bg-on-primary-container hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 sm:px-4"
          >
            <ButtonIcon size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">{buttonText}</span>
          </button>
        )}
      </div>
    </header>
  );
}
