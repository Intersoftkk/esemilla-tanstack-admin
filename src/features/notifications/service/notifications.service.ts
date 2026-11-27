// #/features/notifications/service/notifications.service.ts

import type { NotificationFormData } from "#/features/notifications/schema/notifications-form.schema.ts";
import type { NotificationsListParams } from "#/features/notifications/schema/notifications-search.schema.ts";
import {
	createNotificationFn,
	deleteNotificationFn,
	deleteNotificationsFn,
	getCompaniesFn,
	getNotificationsFn,
	updateNotificationFn,
} from "#/features/notifications/server/notifications.functions.ts";
import type { NotificationRecord } from "#/features/notifications/types/notifications.type.ts";
import type { PaginatedResponse } from "#/types";

/** Client-side wrappers around the server functions for the notifications feature. */
export async function fetchPaginatedNotifications(
	params: NotificationsListParams,
): Promise<PaginatedResponse<NotificationRecord>> {
	return getNotificationsFn({ data: params });
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
	Awaited<ReturnType<typeof getCompaniesFn>>
> {
	return getCompaniesFn();
}

/** Client wrapper for creating a notification. */
export async function createNotification(
	data: NotificationFormData,
): Promise<NotificationRecord> {
	return createNotificationFn({ data });
}

/** Client wrapper for updating a notification. */
export async function updateNotification(
	id: string,
	data: NotificationFormData,
): Promise<NotificationRecord> {
	return updateNotificationFn({ data: { id, payload: data } });
}

/** Client wrapper for deleting a notification. */
export async function deleteNotification(id: string): Promise<void> {
	await deleteNotificationFn({ data: id });
}

/** Client wrapper for deleting several notifications. */
export async function deleteNotifications(ids: string[]): Promise<void> {
	await deleteNotificationsFn({ data: ids });
}
