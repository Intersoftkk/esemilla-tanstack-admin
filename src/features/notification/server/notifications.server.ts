import type {
	NotificationRecord,
	NotificationsResponse,
} from "#/features/notification/types/notification.type.ts";
import { api } from "#/server/api.server.ts";
import type { QueryBuilderInput } from "#/utils/query-builder.ts";
import { buildQueryString } from "#/utils/query-builder.ts";

export type { NotificationsResponse };

/**
 * Fetch paginated list of notifications with optional QueryBuilder input parameters
 * Example URL: /user/notifications?page=1&perPage=15&sort=-created_at
 */
export async function fetchNotifications(
	params?: QueryBuilderInput,
): Promise<NotificationsResponse> {
	const qs = params ? buildQueryString(params) : "";
	const { data } = await api.get<NotificationsResponse | NotificationRecord[]>(
		`/user/notifications${qs}`,
	);

	if (Array.isArray(data)) {
		const unread = data.filter((n) => !n.read_at).length;
		return {
			data,
			unread_count: unread,
			total: data.length,
		};
	}

	return data;
}

/**
 * Fetch a single notification by ID
 */
export async function fetchNotificationById(
	id: string,
): Promise<NotificationRecord> {
	const { data } = await api.get<
		NotificationRecord | { data: NotificationRecord }
	>(`/user/notifications/${encodeURIComponent(id)}`);

	if (typeof data === "object" && data !== null && "data" in data) {
		return (data as { data: NotificationRecord }).data;
	}

	return data;
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(
	id: string,
): Promise<{ success: boolean }> {
	await api.post(`/user/notifications/${encodeURIComponent(id)}/read`);
	return { success: true };
}

/**
 * Mark all user notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<{
	success: boolean;
}> {
	await api.post("/user/notifications/read-all");
	return { success: true };
}

/**
 * Delete a notification by ID
 */
export async function deleteNotification(
	id: string,
): Promise<{ success: boolean }> {
	await api.delete(`/user/notifications/${encodeURIComponent(id)}`);
	return { success: true };
}
