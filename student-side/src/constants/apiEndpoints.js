/**
 * API Endpoints Constants
 * Centralized list of backend routes for the Student Portal.
 */

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return "http://localhost:9000/api";
  const clean = envUrl.replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/student-auth/login",
    ADMIN_LOGIN: "/admin/login",
    ME: "/student-auth/me",
    LOGOUT: "/student-auth/logout",
    CHANGE_PASSWORD: "/student-auth/change-password",
  },
  DASHBOARD: {
    GET_OVERVIEW: "/student-auth/dashboard",
  },
  ATTENDANCE: {
    GET_RECORDS: "/student-auth/attendance",
  },
  TASKS: {
    GET_ALL: "/student-auth/tasks",
    UPDATE_STATUS: "/student-auth/task/status",
  },
  PROJECTS: {
    GET_MY_PROJECTS: "/student-auth/projects",
  },
  TEAM: {
    GET_MY_TEAM: "/student-auth/team",
  },
  NOTIFICATIONS: {
    GET_ALL: "/student-auth/notifications",
    READ_ALL: "/student-auth/read-all",
  },
};
