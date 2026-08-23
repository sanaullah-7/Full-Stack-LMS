import React, { createContext, useState, useEffect, useCallback } from "react";
import { storage } from "../utils/storage";
import { authService } from "../services/auth.service";
import { attendanceService } from "../services/attendance.service";
import { tasksService } from "../services/tasks.service";
import { teamService } from "../services/team.service";
import { notificationService } from "../services/notification.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser() || null);
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlToken = searchParams.get("token");
      if (urlToken) {
        storage.setToken(urlToken);
        return urlToken;
      }
    }
    return storage.getToken() || null;
  });
  const [loading, setLoading] = useState(false);

  // Background Data Prefetcher: primes the cache for instant 0ms transitions
  const prefetchStudentData = useCallback(async () => {
    try {
      const [attRes, tasksRes, teamRes, projRes, notifRes] = await Promise.allSettled([
        attendanceService.getAttendanceRecords(),
        tasksService.getTasks(),
        teamService.getMyTeam(),
        teamService.getMyProjects(),
        notificationService.getNotifications(),
      ]);

      if (attRes.status === "fulfilled") {
        const raw = attRes.value?.attendance || attRes.value?.data || attRes.value || [];
        storage.setCache("attendance", Array.isArray(raw) ? raw : []);
      }
      if (tasksRes.status === "fulfilled") {
        const raw = Array.isArray(tasksRes.value) ? tasksRes.value : [];
        storage.setCache("tasks", raw);
      }
      if (teamRes.status === "fulfilled" && teamRes.value) {
        storage.setCache("team", teamRes.value);
      }
      if (projRes.status === "fulfilled") {
        const raw = Array.isArray(projRes.value) ? projRes.value : [];
        storage.setCache("projects", raw);
      }
      if (notifRes.status === "fulfilled") {
        const raw = Array.isArray(notifRes.value) ? notifRes.value : [];
        storage.setCache("notifications", raw);
      }
    } catch (e) {
      // Background prefetch error (silent)
    }
  }, []);

  // Sync / verify current user session on mount
  useEffect(() => {
    const initAuth = async () => {
      let savedToken = storage.getToken();
      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        const urlToken = searchParams.get("token");
        if (urlToken) {
          storage.setToken(urlToken);
          savedToken = urlToken;
          setToken(urlToken);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

      if (savedToken) {
        // Immediately start background prefetch to warm cache
        prefetchStudentData();

        try {
          const res = await authService.getCurrentStudent();
          if (res?.student) {
            setUser(res.student);
            storage.setUser(res.student);
          }
        } catch (err) {
          console.warn("Session verification failed:", err);
          storage.clearAuth();
          setUser(null);
          setToken(null);
        }
      }
    };

    initAuth();
  }, [prefetchStudentData]);

  const login = useCallback(async (identifier, password) => {
    const res = await authService.login({
      identifier,
      email: identifier,
      password,
    });

    if (res?.token && res?.student) {
      setToken(res.token);
      setUser(res.student);
      storage.setToken(res.token);
      storage.setUser(res.student);
      // Immediately prefetch all data upon login
      prefetchStudentData();
      return res;
    }
    throw new Error(res?.message || "Invalid login response from server");
  }, [prefetchStudentData]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore
    } finally {
      storage.clearAuth();
      setUser(null);
      setToken(null);
    }
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      storage.setUser(merged);
      return merged;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
    updateUser,
    prefetchStudentData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
