import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function formatRelativeTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return date.toLocaleDateString();
}

export default function NotificationPanel({
  notifications = [],
  loading = false,
  error = null,
  onClose,
  onMarkAllRead,
  onNotificationClick,
}) {
  const hasNotifications = notifications.length > 0;

  const panel = (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="fixed right-4 top-[calc(var(--app-header-height)+8px)] z-[9999] w-[min(20rem,calc(100vw-1.5rem))] rounded-lg border border-border bg-surface shadow-lg sm:right-6"
    >
      <div className="flex items-center justify-between border-b border-surface-high px-lg py-md">
        <h3 className="text-sm font-semibold text-text">Notifications</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="cursor-pointer rounded-full p-1 text-text-muted transition-colors duration-fast hover:bg-surface-low hover:text-text"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="space-y-3 px-lg py-md">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3 w-1/3 rounded bg-surface-high" />
                <div className="h-3 w-full rounded bg-surface-high" />
                <div className="h-2 w-1/4 rounded bg-surface-high" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-lg py-2xl text-center text-sm text-text-muted">
            {error}
          </div>
        ) : hasNotifications ? (
          notifications.map((notif) => (
            <button
              key={notif._id || notif.id}
              type="button"
              onClick={() => onNotificationClick?.(notif)}
              className={`block w-full cursor-pointer border-b border-surface-high px-lg py-md text-left transition-colors duration-fast last:border-b-0 hover:bg-surface-low ${
                notif.read ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                {!notif.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
                <div className={!notif.read ? "" : "pl-4"}>
                  <p className="text-sm font-medium text-text">{notif.title}</p>
                  <p className="mt-xs text-xs text-text-muted">
                    {notif.message || notif.description}
                  </p>
                  <p className="mt-xs text-xs text-text-muted">
                    {formatRelativeTime(notif.createdAt) || notif.time || ""}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="px-lg py-2xl text-center text-sm text-text-muted">
            No notifications
          </div>
        )}
      </div>

      <div className="border-t border-surface-high px-lg py-sm text-center">
        {hasNotifications ? (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="cursor-pointer text-xs font-medium text-primary underline-offset-2 transition-colors duration-fast hover:underline"
          >
            Mark all as read
          </button>
        ) : (
          <p className="text-xs text-text-muted">No unread notifications</p>
        )}
      </div>
    </motion.div>
  );

  return createPortal(panel, document.body);
}
