import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { StudentLayout } from "../components/layout/StudentLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

// Page Components
import { Login } from "../pages/auth/Login";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Attendance } from "../pages/attendance/Attendance";
import { Tasks } from "../pages/tasks/Tasks";
import { Team } from "../pages/team/Team";
import { Project } from "../pages/project/Project";
import { Profile } from "../pages/profile/Profile";
import { NotFound } from "../pages/not-found/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Student Portal Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="project" element={<Project />} />
        <Route path="team" element={<Team />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
