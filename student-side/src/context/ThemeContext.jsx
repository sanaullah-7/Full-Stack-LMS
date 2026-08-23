import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("saylani_lms_theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("saylani_lms_theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      localStorage.setItem("saylani_lms_theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
