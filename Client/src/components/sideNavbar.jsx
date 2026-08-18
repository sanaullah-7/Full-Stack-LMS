import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UsersRound,
  FolderKanban,
  ListTodo,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { useAuth } from "../context/authContextObject";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    tone: "text-primary",
  },
  {
    label: "Students",
    icon: Users,
    path: "/students",
    tone: "text-[var(--color-primary)]",
  },
  {
    label: "Attendance",
    icon: CalendarDays,
    path: "/attendance",
    tone: "text-warning",
  },
  {
    label: "Teams",
    icon: UsersRound,
    path: "/teams",
    tone: "text-success",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    path: "/projects",
    tone: "text-[var(--color-primary-container)]",
  },
  { label: "Tasks", icon: ListTodo, path: "/tasks", tone: "text-error" },
];

export default function SideNavBar({ mobileOpen = false, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    if (onMobileClose) onMobileClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay — desktop unchanged */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onMobileClose}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={[
          "flex h-screen flex-col border-r border-border bg-surface/98 font-sans shadow-[4px_0_24px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-normal ease-in-out",
          // Mobile: off-canvas drawer
          "fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: original static sidebar (unchanged widths)
          "lg:static lg:z-auto lg:translate-x-0 lg:max-w-none",
          collapsed ? "lg:w-20" : "lg:w-64",
        ].join(" ")}
      >
        {/* Logo + collapse toggle (collapse only on desktop) */}
        <div
          className={`flex h-[var(--app-header-height)] shrink-0 items-center border-b border-border px-md transition-all duration-normal ${
            collapsed ? "lg:justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center overflow-hidden ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <img
              src="/logo.png"
              alt="SMIT logo"
              className="block h-16 w-auto max-w-[200px] object-contain transition-all duration-200"
            />
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-fast hover:bg-surface-low hover:text-text lg:flex"
          >
            <ChevronLeft
              size={18}
              strokeWidth={2}
              className={`transition-transform duration-normal ease-in-out ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-sm">
          <ul className="flex flex-col gap-2 px-sm">
            {NAV_ITEMS.map(({ label, icon: Icon, path, tone }) => (
              <li key={label} className="relative">
                <NavLink
                  to={path}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    [
                      "group relative flex items-center rounded-lg py-2.5 text-sm transition-all duration-fast cursor-pointer",
                      collapsed
                        ? "justify-start gap-sm px-md lg:justify-center lg:gap-0 lg:px-sm"
                        : "gap-sm px-md",
                      isActive
                        ? "bg-primary/10 font-semibold text-primary shadow-sm ring-1 ring-primary/15"
                        : "text-text-muted hover:bg-surface-low hover:text-text",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                          aria-hidden
                        />
                      )}
                      <Icon
                        size={20}
                        strokeWidth={2}
                        className={`shrink-0 ${isActive ? "text-primary" : tone}`}
                      />
                      <span
                        className={`whitespace-nowrap ${
                          collapsed ? "lg:hidden" : ""
                        }`}
                      >
                        {label}
                      </span>
                      {collapsed && (
                        <div className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white shadow-md lg:group-hover:block">
                          {label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-surface-high px-sm py-md">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className={`group relative flex w-full cursor-pointer items-center rounded-lg py-2.5 text-sm text-error transition-colors duration-fast hover:bg-error/10 ${
              collapsed
                ? "justify-start gap-sm px-md lg:justify-center lg:gap-0 lg:px-sm"
                : "gap-sm px-md"
            }`}
          >
            <LogOut size={20} strokeWidth={2} className="shrink-0" />
            <span
              className={`whitespace-nowrap ${collapsed ? "lg:hidden" : ""}`}
            >
              Logout
            </span>
            {collapsed && (
              <div className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white shadow-md lg:group-hover:block">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
