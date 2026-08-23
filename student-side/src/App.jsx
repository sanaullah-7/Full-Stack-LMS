import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                fontSize: "14px",
                borderRadius: "10px",
                boxShadow: "var(--shadow-md)",
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
