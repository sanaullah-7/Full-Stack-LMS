import { useMemo, useState } from "react";
import { AuthContext } from "./authContextObject";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "../utils/authToken";

export function AuthProvider({ children }) {
  // Check for handover token in URL (e.g. redirected from Student Portal) or session storage
  const [token, setToken] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        const urlToken = searchParams.get("token");
        if (urlToken) {
          setAuthToken(urlToken);
          window.history.replaceState({}, document.title, window.location.pathname);
          return urlToken;
        }
      }
      localStorage.removeItem("token");
    } catch {
      // ignore
    }
    return getAuthToken();
  });

  const value = useMemo(() => {
    const login = (newToken) => {
      setAuthToken(newToken);
      setToken(newToken);
    };

    const logout = () => {
      clearAuthToken();
      setToken(null);
    };

    return {
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    };
  }, [token]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
