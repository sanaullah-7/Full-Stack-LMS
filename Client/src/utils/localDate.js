import dayjs from "dayjs";

/** Canonical attendance date format */
export const DATE_FORMAT = "YYYY-MM-DD";

/** Browser local calendar today as YYYY-MM-DD (never UTC toISOString). */
export function getLocalToday() {
  return dayjs().format(DATE_FORMAT);
}

/** Normalize any parseable value to YYYY-MM-DD (local). */
export function toYmd(value) {
  const d = dayjs(value);
  return d.isValid() ? d.format(DATE_FORMAT) : getLocalToday();
}

/** Parse YYYY-MM-DD as local calendar day (for week/month math). */
export function parseLocalYmd(ymd) {
  return dayjs(`${toYmd(ymd)}T00:00:00`);
}

/** Long display label for a YYYY-MM-DD date (local). */
export function formatLongLocalDate(ymd) {
  return parseLocalYmd(ymd).format("dddd, MMMM D, YYYY");
}
