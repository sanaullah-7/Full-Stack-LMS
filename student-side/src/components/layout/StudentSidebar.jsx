import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { LogOut, ChevronLeft, ChevronRight, User, Moon, Sun } from "lucide-react";

export const StudentSidebar = ({ collapsed, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setShowMenu(false);
    await logout();
    navigate("/login");
  };

  // Helper for initials
  const getInitials = (name) => {
    if (!name) return "ST";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Close popup menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        {!collapsed && (
          <img src="/smit-logo.png" alt="SMIT" className="sidebar-smit-logo" />
        )}
        <button
          type="button"
          className="sidebar-toggle-inside-btn"
          onClick={onToggleSidebar}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-6 h-6" size={24} strokeWidth={2.2} />
          ) : (
            <ChevronLeft className="w-6 h-6" size={24} strokeWidth={2.2} />
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              title={collapsed ? item.title : undefined}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Footer Section */}
      <div className="sidebar-bottom" ref={menuRef} style={{ position: "relative" }}>
        {showMenu && (
          <div className="sidebar-profile-popover">
            <button
              type="button"
              className="sidebar-popover-item"
              onClick={() => {
                setShowMenu(false);
                navigate("/profile");
              }}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              className="sidebar-popover-item"
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              <span className={`sidebar-popover-switch ${isDark ? "active" : ""}`}></span>
            </button>


            <div className="sidebar-popover-divider"></div>

            <button
              type="button"
              className="sidebar-popover-item text-danger"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 text-danger" />
              <span>Log out</span>
            </button>
          </div>
        )}

        <button
          type="button"
          className="sidebar-user-btn"
          onClick={() => setShowMenu(!showMenu)}
          title={user?.name || "Muhammad Junaid"}
          aria-label="User Profile Menu"
        >
          {!collapsed && (
            <span className="sidebar-user-name">
              {user?.name || "Muhammad Junaid"}
            </span>
          )}
          <div className="sidebar-user-avatar">
            {getInitials(user?.name || "Muhammad Junaid")}
          </div>
        </button>
      </div>
    </aside>
  );
};

