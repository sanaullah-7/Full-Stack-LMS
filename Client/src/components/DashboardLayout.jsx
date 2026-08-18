import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Plus, CalendarCheck, UsersRound, ListTodo, FolderKanban } from "lucide-react";
import SideNavBar from "./sideNavbar";
import TopBar from "./TopBar";

const topBarConfig = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your bootcamp",
    showNotification: true,
    showButton: false,
  },
  "/students": {
    title: "Students",
    subtitle: "Manage all enrolled students",
    showNotification: false,
    showButton: true,
    buttonText: "Add Student",
    buttonIcon: Plus,
    onButtonClick: () => window.dispatchEvent(new CustomEvent("openAddStudent")),
  },
  "/attendance": {
    title: "Attendance",
    subtitle: "Track daily attendance records",
    showNotification: false,
    showButton: true,
    buttonText: "Take Attendance",
    buttonIcon: CalendarCheck,
    onButtonClick: () =>
      window.dispatchEvent(new CustomEvent("openTakeAttendance")),
  },
  "/teams": {
    title: "Teams",
    subtitle: "View and manage project teams",
    showNotification: false,
    showButton: true,
    buttonText: "Create Team",
    buttonIcon: UsersRound,
    onButtonClick: () =>
      window.dispatchEvent(new CustomEvent("openCreateTeamModal")),
  },
  "/projects": {
    title: "Projects",
    subtitle: "Manage and view all projects.",
    showNotification: false,
    showButton: true,
    buttonText: "Create Project",
    buttonIcon: FolderKanban,
    onButtonClick: () =>
      window.dispatchEvent(new CustomEvent("openCreateProjectModal")),
  },
  "/tasks": {
    title: "Tasks",
    subtitle: "Assign and review student tasks",
    showNotification: false,
    showButton: true,
    buttonText: "New Task",
    buttonIcon: ListTodo,
    onButtonClick: () =>
      window.dispatchEvent(new CustomEvent("openCreateTask")),
  },
};

export default function DashboardLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const config =
    topBarConfig[currentPath] ||
    (currentPath.startsWith("/students/")
      ? {
          title: "Student Profile",
          subtitle: "View student details and activity",
          showNotification: false,
          showButton: false,
        }
      : null) ||
    (currentPath.startsWith("/team")
      ? { ...topBarConfig["/teams"], showButton: false }
      : null) || {
      title: "Bootcamp LMS",
      subtitle: "",
      showNotification: false,
      showButton: false,
    };

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden">
      <SideNavBar
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          title={config.title}
          subtitle={config.subtitle}
          showNotification={config.showNotification === true}
          showButton={config.showButton}
          buttonText={config.buttonText}
          buttonIcon={config.buttonIcon}
          onButtonClick={config.onButtonClick}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="app-main min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
