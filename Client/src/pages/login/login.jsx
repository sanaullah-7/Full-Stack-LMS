import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../Services/auth.services";
import { useAuth } from "../../context/authContextObject";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Users,
  CalendarDays,
  UsersRound,
  FolderKanban,
  ListTodo,
} from "lucide-react";

const HIGHLIGHTS = [
  { label: "Students", icon: Users },
  { label: "Attendance", icon: CalendarDays },
  { label: "Teams", icon: UsersRound },
  { label: "Projects", icon: FolderKanban },
  { label: "Tasks", icon: ListTodo },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginAdmin(email, password);
      const token = data?.token;
      if (!token) {
        throw new Error("Login succeeded but no token was returned");
      }

      // Must update AuthContext — ProtectedRoute reads this, not only localStorage
      login(token);
      toast.success("Login successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Invalid Email or password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh lg:h-dvh lg:grid lg:grid-cols-2 lg:overflow-hidden">
      {/* Left brand panel */}
      <div className="relative hidden h-full min-h-0 flex-col overflow-hidden bg-[#004a75] p-8 text-white lg:flex xl:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(41,169,255,0.35), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(0,99,155,0.5), transparent 50%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-[540px] flex-col gap-5">
          {/* Top — always visible */}
          <div className="shrink-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/70">
              Saylani Bootcamp
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight xl:text-4xl">
              Bootcamp LMS
            </h2>
            {/* <p className="mt-2 text-base leading-relaxed text-blue-100/85">
              One clear dashboard to run your whole bootcamp with confidence.
            </p> */}
          </div>

          {/* Logo — uses leftover space only */}
          <div className="flex min-h-90 flex-1 -mt-10 items-center justify-center">
            <img
              src="/admin-login-logo.png"
              alt="SMIT Logo"
              className="max-h-full w-auto max-w-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Bottom — always visible */}
          <div className="shrink-0 space-y-4 -mt-10 ">
            <p className="text-base font-medium leading-relaxed text-blue-50/95 xl:text-lg">
              Manage students, mark attendance, build teams, track projects, and
              assign tasks from one connected system.
            </p>

            <div className="flex flex-wrap gap-2">
              {HIGHLIGHTS.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50 backdrop-blur-sm"
                >
                  <Icon size={14} strokeWidth={2} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex min-h-dvh flex-col justify-center bg-[var(--color-background)] px-6 py-8 sm:px-12 lg:min-h-0 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Sign in to open your bootcamp command center.
          </p>

          <form onSubmit={handleLogin} className="mt-7 flex flex-col gap-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-[13px] font-medium text-[var(--color-text)]"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bootcamp.dev"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-outline)]/50 transition-all focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-[13px] font-medium text-[var(--color-text)]"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pr-10 pl-3.5 text-sm text-[var(--color-text)] placeholder-[var(--color-outline)]/60 transition-all focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={2} />
                  ) : (
                    <Eye size={16} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full cursor-pointer rounded-lg bg-[var(--color-primary)] py-3 text-sm font-semibold text-[var(--color-on-primary)] transition-all hover:bg-[var(--color-on-primary-container)] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
