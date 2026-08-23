import React, { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { attendanceService } from "../../services/attendance.service";
import { storage } from "../../utils/storage";
import {
  Clock,
  CheckCircle2,
  ChevronDown,
  Loader2,
} from "lucide-react";

export const Attendance = () => {
  const { user } = useAuth();
  const { setPageTitle } = useOutletContext();

  // Instant SWR Cache Hydration: 0ms initial load
  const [attendanceRecords, setAttendanceRecords] = useState(
    () => storage.getCache("attendance") || []
  );
  const [loading, setLoading] = useState(() => !storage.getCache("attendance"));
  const [selectedMonth, setSelectedMonth] = useState("Aug 2026");

  useEffect(() => {
    setPageTitle("Attendance");
    fetchAttendance();
  }, [setPageTitle]);

  const fetchAttendance = async () => {
    try {
      if (!storage.getCache("attendance")) {
        setLoading(true);
      }
      const res = await attendanceService.getAttendanceRecords();
      const raw = res?.attendance || res?.data || res || [];
      const records = Array.isArray(raw) ? raw : [];
      setAttendanceRecords(records);
      storage.setCache("attendance", records);
    } catch (err) {
      console.warn("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalClasses = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  // Month formatting helper
  const getMonthYear = (dateStr) => {
    if (!dateStr) return "Aug 2026";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "Aug 2026"
      : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Available unique months list
  const availableMonths = useMemo(() => {
    const set = new Set();
    const currentMY = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
    set.add(currentMY);
    set.add("Aug 2026");

    attendanceRecords.forEach((r) => {
      if (r.date) set.add(getMonthYear(r.date));
    });
    return Array.from(set);
  }, [attendanceRecords]);

  // Filtered records by selected month
  const filteredRecords = useMemo(() => {
    if (!selectedMonth || selectedMonth === "All Months") return attendanceRecords;
    return attendanceRecords.filter((r) => getMonthYear(r.date) === selectedMonth);
  }, [attendanceRecords, selectedMonth]);

  return (
    <div className="inner-page active fade-in">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-headline">Attendance</h1>
          <p className="page-sub">
            Your attendance record · Batch {user?.batch || "11"} · {user?.course || "MERN Stack Development"}
          </p>
        </div>
      </div>

      {/* Reverted 2 Clean Stat Cards */}
      <div className="stat-row lms-stat-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card lms-metric-card">
          <div className="lms-metric-info">
            <span className="lms-metric-number">{presentCount}/{totalClasses}</span>
            <span className="lms-metric-label">Attendance</span>
          </div>
          <div className="lms-metric-icon-wrap clock">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="stat-card lms-metric-card">
          <div className="lms-metric-info">
            <span className="lms-metric-number">{attendanceRate}%</span>
            <span className="lms-metric-label">Attendance Rate</span>
          </div>
          <div className="lms-metric-icon-wrap clock">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Attendance Overview Progress Card with Percentage & Line */}
      <div className="card" style={{ padding: "1.5rem 1.75rem", marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", margin: 0 }}>
              Attendance Overview
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              {attendanceRate >= 75
                ? "Your attendance is good. Keep it up!"
                : "Your attendance is below 75%. Please attend upcoming classes to avoid short attendance."}
            </p>
          </div>
          <span
            style={{
              fontSize: "1.85rem",
              fontWeight: "800",
              color: attendanceRate >= 75 ? "var(--success)" : "var(--warn)",
              lineHeight: 1,
            }}
          >
            {attendanceRate}%
          </span>
        </div>

        {/* Progress Bar Line */}
        <div
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "9999px",
            background: "var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${attendanceRate}%`,
              height: "100%",
              borderRadius: "9999px",
              background: attendanceRate >= 75 ? "var(--success)" : "var(--warn)",
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      {/* Month Filter Dropdown Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div style={{ position: "relative", minWidth: "150px" }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="field-input"
            style={{
              width: "100%",
              padding: "0.5rem 2.2rem 0.5rem 1rem",
              fontSize: "13.5px",
              fontWeight: "500",
              borderRadius: "8px",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value="All Months">All Months</option>
          </select>
          <ChevronDown
            size={16}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--text-muted)",
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="card" style={{ padding: "0.5rem 1.5rem 1.25rem" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th
                  style={{
                    padding: "1rem 1rem",
                    fontWeight: "500",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  Class
                </th>
                <th
                  style={{
                    padding: "1rem 1rem",
                    fontWeight: "500",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "1rem 1rem",
                    fontWeight: "500",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    textAlign: "right",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: "3rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "13.5px",
                    }}
                  >
                    <Loader2 className="w-6 h-6 animate-spin" style={{ margin: "0 auto 8px", color: "var(--accent)" }} />
                    Loading attendance records...
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((item) => (
                  <tr
                    key={item._id || item.date}
                    style={{ borderBottom: "1px solid var(--border)", transition: "background 150ms" }}
                  >
                    <td
                      style={{
                        padding: "1rem 1rem",
                        fontSize: "13.5px",
                        fontWeight: "500",
                        color: "var(--text)",
                      }}
                    >
                      {user?.course || "MERN Stack Development"}
                    </td>
                    <td
                      style={{
                        padding: "1rem 1rem",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "--"}
                      {item.checkInTime ? ` · ${item.checkInTime}` : ""}
                    </td>
                    <td style={{ padding: "1rem 1rem", textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "4px",
                          background:
                            item.status === "Present"
                              ? "rgba(34, 197, 94, 0.12)"
                              : item.status === "Leave"
                              ? "rgba(234, 179, 8, 0.12)"
                              : "rgba(239, 68, 68, 0.12)",
                          color:
                            item.status === "Present"
                              ? "var(--success)"
                              : item.status === "Leave"
                              ? "var(--warn)"
                              : "var(--danger)",
                          border: `1px solid ${
                            item.status === "Present"
                              ? "rgba(34, 197, 94, 0.25)"
                              : item.status === "Leave"
                              ? "rgba(234, 179, 8, 0.25)"
                              : "rgba(239, 68, 68, 0.25)"
                          }`,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: "3.5rem 1rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "13.5px",
                    }}
                  >
                    No attendance records for this month
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
