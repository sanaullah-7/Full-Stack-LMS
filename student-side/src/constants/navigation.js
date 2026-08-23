import {
  LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  Users,
  User,
  Folder,
  LogOut,
} from "lucide-react";

/**
 * Sidebar navigation configuration
 */
export const NAV_ITEMS = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & key metrics",
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
    description: "Attendance history & stats",
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
    description: "Assignments & submissions",
  },
  {
    title: "Project",
    path: "/project",
    icon: Folder,
    description: "Assigned project deliverables",
  },
  {
    title: "Team",
    path: "/team",
    icon: Users,
    description: "Team roster and activity",
  },
];

