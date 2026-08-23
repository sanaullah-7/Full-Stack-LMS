/**
 * Portal URLs for cross-portal navigation and silent token handover.
 */

export const getStudentPortalUrl = () => {
  if (import.meta.env.VITE_STUDENT_PORTAL_URL) {
    return import.meta.env.VITE_STUDENT_PORTAL_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5174";
    }
  }
  return "https://saylani-bootcamp-student.vercel.app";
};

export const getAdminPortalUrl = () => {
  if (import.meta.env.VITE_ADMIN_PORTAL_URL) {
    return import.meta.env.VITE_ADMIN_PORTAL_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5173";
    }
  }
  return "https://smit-bootcamp-lms.vercel.app";
};
