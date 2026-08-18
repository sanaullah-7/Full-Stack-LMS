import api from "../api/axios";

export async function fetchNotifications(limit = 50) {
  const response = await api.get("/api/notifications", {
    params: { limit },
  });
  return response.data;
}

export async function fetchUnreadNotificationCount() {
  const response = await api.get("/api/notifications/unread-count");
  return response.data;
}

export async function markNotificationAsRead(id) {
  const response = await api.patch(`/api/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch("/api/notifications/read-all");
  return response.data;
}
