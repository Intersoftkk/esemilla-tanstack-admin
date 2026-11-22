import { createServerFn } from "@tanstack/react-start";
import { notificationIdSchema } from "#/features/notification/schema/notification.schema.ts";
import {
	mapNotificationSearchToQuery,
	type NotificationSearch,
	type NotificationSearchInput,
	notificationSearchSchema,
} from "#/features/notification/schema/notification-search.schema.ts";
import {
	deleteNotification,
	fetchNotificationById,
	fetchNotifications,
	markAllNotificationsAsRead,
	markNotificationAsRead,
	type NotificationsResponse,
} from "#/features/notification/server/notifications.server.ts";
import type { NotificationRecord } from "#/features/notification/types/notification.ts";

export type { NotificationsResponse };

export const getNotificationsFn = createServerFn({ method: "GET" })
	.validator((data?: NotificationSearchInput) =>
		notificationSearchSchema.parse(data ?? {}),
	)
	.handler(async ({ data }): Promise<NotificationsResponse> => {
		const searchParams = data as NotificationSearch;
		const queryInput = mapNotificationSearchToQuery(searchParams);
		return await fetchNotifications(queryInput);
	});

export const getNotificationByIdFn = createServerFn({ method: "GET" })
	.validator((data: string) => notificationIdSchema.parse(data))
	.handler(async ({ data: id }): Promise<NotificationRecord> => {
		return await fetchNotificationById(id);
	});

export const markNotificationReadFn = createServerFn({ method: "POST" })
	.validator((data: string) => notificationIdSchema.parse(data))
	.handler(async ({ data: id }): Promise<{ success: boolean }> => {
		return await markNotificationAsRead(id);
	});

export const markAllNotificationsReadFn = createServerFn({
	method: "POST",
}).handler(async (): Promise<{ success: boolean }> => {
	return await markAllNotificationsAsRead();
});

export const deleteNotificationFn = createServerFn({ method: "POST" })
	.validator((data: string) => notificationIdSchema.parse(data))
	.handler(async ({ data: id }): Promise<{ success: boolean }> => {
		return await deleteNotification(id);
	});
