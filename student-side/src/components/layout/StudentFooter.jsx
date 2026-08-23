import React from "react";

export const StudentFooter = () => {
  return (
    <footer className="mt-auto py-6 px-6 border-t border-[var(--color-border-subtle)] text-center text-xs text-[var(--color-text-muted)]">
      <p>
        © {new Date().getFullYear()} Saylani Welfare International Trust •
        Student Learning Management System
      </p>
    </footer>
  );
};
