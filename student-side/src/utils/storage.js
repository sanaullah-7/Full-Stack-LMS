const TOKEN_KEY = "saylani_student_token";
const USER_KEY = "saylani_student_user";
const CACHE_PREFIX = "saylani_student_cache_";

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),

  // Fast SWR Cache for 0ms Instant Page Hydration
  getCache: (key) => {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.data ?? null;
    } catch {
      return null;
    }
  },

  setCache: (key, data) => {
    try {
      localStorage.setItem(
        CACHE_PREFIX + key,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (e) {
      console.warn("Storage quota exceeded or error caching:", e);
    }
  },

  removeCache: (key) => {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Clear cached student datasets on logout
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },
};
