/**
 * Status Types & Enums
 */
export const ATTENDANCE_STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LEAVE: "Leave",
  LATE: "Late",
};

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  COMPLETED: "completed",
  OVERDUE: "overdue",
};

export const BADGE_VARIANTS = {
  [ATTENDANCE_STATUS.PRESENT]: "success",
  [ATTENDANCE_STATUS.ABSENT]: "error",
  [ATTENDANCE_STATUS.LEAVE]: "warning",
  [ATTENDANCE_STATUS.LATE]: "warning",
  [TASK_STATUS.PENDING]: "warning",
  [TASK_STATUS.IN_PROGRESS]: "info",
  [TASK_STATUS.SUBMITTED]: "primary",
  [TASK_STATUS.COMPLETED]: "success",
  [TASK_STATUS.OVERDUE]: "error",
};
