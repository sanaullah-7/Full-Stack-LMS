import React from "react";
import { Select } from "../common/Select";

export const AttendanceFilter = ({ filter, setFilter }) => {
  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Present Only", value: "Present" },
    { label: "Absent Only", value: "Absent" },
    { label: "Leave Only", value: "Leave" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
      <h3 className="text-base font-semibold text-[var(--color-text)]">
        Attendance Logs
      </h3>
      <div className="w-full sm:w-48">
        <Select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          options={statusOptions}
        />
      </div>
    </div>
  );
};
