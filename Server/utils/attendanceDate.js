/**
 * Attendance calendar dates are stored/queried as UTC midnight
 * for a YYYY-MM-DD business day string from the client.
 */

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

export function assertYmd(dateStr) {
  const raw = String(dateStr ?? "").trim();
  if (!YMD_RE.test(raw)) {
    throw new Error("Invalid date. Use YYYY-MM-DD");
  }
  return raw;
}

/** Normalize YYYY-MM-DD → Date at UTC midnight (stable day key). */
export function toAttendanceDate(dateStr) {
  const ymd = assertYmd(dateStr);
  return new Date(`${ymd}T00:00:00.000Z`);
}

/** Inclusive start / exclusive end for one calendar day. */
export function getAttendanceDayRange(dateStr) {
  const start = toAttendanceDate(dateStr);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end, ymd: assertYmd(dateStr) };
}

/** Sunday check against the calendar day (UTC weekday of that YMD). */
export function isSundayYmd(dateStr) {
  return toAttendanceDate(dateStr).getUTCDay() === 0;
}
