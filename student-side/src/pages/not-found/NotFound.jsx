import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Home } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-7xl font-extrabold text-[var(--color-primary)]">
        404
      </h1>
      <h2 className="text-xl font-bold text-[var(--color-text)] mt-4">
        Page Not Found
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] max-w-md mt-2 mb-6">
        The student portal page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={Home}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
