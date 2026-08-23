import React from "react";
import { Select } from "../common/Select";
import { Input } from "../common/Input";
import { Search } from "lucide-react";

export const TaskFilter = ({ filters, setFilters }) => {
  const statusOptions = [
    { label: "All Tasks", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Submitted", value: "submitted" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="w-full sm:w-72">
        <Input
          placeholder="Search tasks..."
          icon={Search}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="w-full sm:w-48">
        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          options={statusOptions}
        />
      </div>
    </div>
  );
};
