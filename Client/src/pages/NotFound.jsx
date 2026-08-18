import { Link } from "react-router-dom";
import { Home, LogIn, MapPinOff } from "lucide-react";
import { useAuth } from "../context/authContextObject";

/** Shown for unknown URLs (e.g. /foo) — does not clear the session. */
export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const homePath = isAuthenticated ? "/dashboard" : "/login";
  const homeLabel = isAuthenticated ? "Back to Dashboard" : "Go to Login";
  const HomeIcon = isAuthenticated ? Home : LogIn;

  return (
    <div className="app-main flex min-h-dvh items-center justify-center px-4 py-6 sm:px-8">
      <div className="app-panel  px-6 py-7 sm:px-10 sm:py-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
          <div className="flex shrink-0 flex-col items-center sm:items-start">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <MapPinOff size={28} strokeWidth={1.75} aria-hidden />
            </div>
            <p className="text-5xl font-bold leading-none tracking-tight text-[var(--color-primary)]">
              404
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
              Page not found
            </h1>
            <p className="mt-2 text-sm leading-normal text-[var(--color-text-muted)]">
              This page does not exist or may have been moved. Check the URL
              and try again.
            </p>
            <Link
              to={homePath}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-on-primary)] shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            >
              <HomeIcon size={17} strokeWidth={2} aria-hidden />
              {homeLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
