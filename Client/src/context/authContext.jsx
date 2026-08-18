import { useMemo, useState } from "react";
import { AuthContext } from "./authContextObject";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "../utils/authToken";

export function AuthProvider({ children }) {
  // Clear any leftover localStorage token from older builds on boot
  const [token, setToken] = useState(() => {
    try {
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
