/**
 * Date and Text Formatting Utilities
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null) return "0%";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? "0%" : `${num.toFixed(1)}%`;
};

export const truncateText = (text, maxLength = 60) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const getInitials = (name) => {
  if (!name) return "ST";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
