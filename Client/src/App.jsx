import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/login/login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/dashboard";
import StudentsList from "./pages/students/StudentsList";
import StudentProfile from "./pages/students/StudentProfile";
import AttendanceList from "./pages/attendance/AttendanceList";
import Task from "./pages/task/Task";
import TeamsPage from "./pages/TeamPage/Team";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/authContextObject";

/** `/` — no dashboard flash; go login or dashboard based on session. */
function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return (
    <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
  );
}

/**
 * Visiting `/login` clears any existing session once (like logout),
 * then shows the login form.
 */
function LoginRoute() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    // Only on first enter of /login — do not re-run after successful login(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Login />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            position: "top-center",
          },
          error: {
            position: "top-right",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginRoute />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<StudentsList />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tasks" element={<Task />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
