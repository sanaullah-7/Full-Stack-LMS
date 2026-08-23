import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { getAdminPortalUrl } from "../../utils/portalUrls";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Users,
  CalendarDays,
  UsersRound,
  FolderKanban,
  ListTodo,
  Loader2,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

const HIGHLIGHTS = [
  { label: "Attendance", icon: CalendarDays },
  { label: "Assignments", icon: ListTodo },
  { label: "Teams", icon: UsersRound },
  { label: "Projects", icon: FolderKanban },
  { label: "Community", icon: Users },
];

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("student"); // 'student' | 'admin'
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.password.trim()) {
      toast.error(
        role === "student"
          ? "Please enter your Roll Number or Email and Password."
          : "Please enter your Admin Email and Password."
      );
      return;
    }

    setLoading(true);

    try {
      if (role === "student") {
        await login(formData.identifier.trim(), formData.password);
        toast.success("Successfully logged in!");
        navigate("/dashboard", { replace: true });
      } else {
        // Logging in as Admin from Student Portal
        const res = await authService.loginAdmin({
          email: formData.identifier.trim(),
          password: formData.password,
        });

        const token = res?.token;
        if (!token) {
          throw new Error("Admin login succeeded but token was missing.");
        }

        toast.success("Admin verified! Redirecting to Admin Portal...");
        const targetUrl = `${getAdminPortalUrl()}/login?token=${encodeURIComponent(
          token
        )}&role=admin`;

        // Smooth brief transition then silent redirection
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 500);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "var(--bg)",
      }}
    >
      {/* Left Brand Panel — Saylani Deep Blue with Hero Logo & Highlights */}
      <div
        className="login-left-panel"
        style={{
          flex: "1 1 52%",
          background: "#004a75",
          padding: "3.5rem",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(41,169,255,0.4), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(0,99,155,0.6), transparent 50%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "520px",
            margin: "0 auto",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top Headline */}
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(224, 242, 254, 0.8)",
                margin: "0 0 8px 0",
              }}
            >
              Saylani Mass IT Training
            </p>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "800",
                letterSpacing: "-0.02em",
                color: "#ffffff",
                margin: 0,
              }}
            >
              Bootcamp Portal
            </h1>
          </div>

          {/* Center Illustration */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "2rem 0",
            }}
          >
            <img
              src="/smit-hero-logo.png"
              alt="SMIT Hero Logo"
              style={{
                maxHeight: "270px",
                maxWidth: "100%",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))",
              }}
              onError={(e) => {
                e.currentTarget.src = "/smit-logo.png";
              }}
            />
          </div>

          {/* Bottom Highlights */}
          <div>
            <p
              style={{
                fontSize: "15px",
                fontWeight: "500",
                lineHeight: "1.6",
                color: "rgba(240, 249, 255, 0.95)",
                marginBottom: "1.25rem",
              }}
            >
              Track your attendance, build team projects, submit assignments, and
              collaborate with mentors from one unified system.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {HIGHLIGHTS.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    background: "rgba(255, 255, 255, 0.12)",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#f0f9ff",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div
        className="login-form-panel"
        style={{
          flex: "1 1 48%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3.5rem 3rem",
          background: "var(--surface)",
        }}
      >
        <div
          className="login-form-inner"
          style={{ width: "100%", maxWidth: "390px" }}
        >
          <div
            className="login-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.75rem",
            }}
          >
            <img
              src="/smit-logo.png"
              alt="SMIT Logo"
              style={{ height: "38px", objectFit: "contain" }}
            />
          </div>

          {/* Role Switcher Slider */}
          <div
            style={{
              display: "flex",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "1.5rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setFormData({ identifier: "", password: "" });
              }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: "600",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: role === "student" ? "var(--primary)" : "transparent",
                color: role === "student" ? "#ffffff" : "var(--text-muted)",
                boxShadow:
                  role === "student" ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
              }}
            >
              <GraduationCap size={15} />
              Student Login
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setFormData({ identifier: "", password: "" });
              }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: "600",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: role === "admin" ? "var(--primary)" : "transparent",
                color: role === "admin" ? "#ffffff" : "var(--text-muted)",
                boxShadow:
                  role === "admin" ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
              }}
            >
              <ShieldCheck size={15} />
              Admin Login
            </button>
          </div>

          <h1 className="login-headline">
            {role === "student" ? "Welcome back." : "Admin Access."}
          </h1>
          <p className="login-sub">
            {role === "student"
              ? "Sign in to your Saylani Bootcamp student portal."
              : "Sign in to open your bootcamp command center."}
          </p>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-field">
              <label htmlFor="identifier" className="field-label">
                {role === "student" ? "Roll Number or Email" : "Admin Email"}
              </label>
              <input
                id="identifier"
                name="identifier"
                type={role === "admin" ? "email" : "text"}
                placeholder={
                  role === "student"
                    ? "e.g. 100234 or student@smitlms.com"
                    : "admin@smitlms.com"
                }
                className="field-input"
                autoComplete="username"
                value={formData.identifier}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="field-password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="field-input"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <button
                type="button"
                className="forgot-link"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "right",
                  display: "block",
                  width: "100%",
                }}
                onClick={() =>
                  toast(
                    "Please contact your campus administrator to reset your password.",
                    {
                      icon: "ℹ️",
                    }
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-primary btn-full"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "0.85rem",
                marginTop: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {role === "student"
                      ? "Signing in to Student..."
                      : "Authenticating Admin..."}
                  </span>
                </>
              ) : (
                <span>
                  {role === "student"
                    ? "Sign in as Student"
                    : "Sign in as Admin"}
                </span>
              )}
            </button>
          </form>

          <p className="signup-cta" style={{ marginTop: "2rem" }}>
            Need help?{" "}
            <a
              href="mailto:support@saylaniwelfare.com"
              style={{ color: "var(--accent)", fontWeight: 500 }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
