import type { NotificationSearchInput } from "#/features/notification/schema/notification-search.schema.ts";

export const NOTIFICATION_KEYS = {
	all: ["notifications"] as const,
	lists: (params?: NotificationSearchInput) =>
		[...NOTIFICATION_KEYS.all, "lists", params ?? {}] as const,
	list: (params?: NotificationSearchInput) =>
		params
			? ([...NOTIFICATION_KEYS.all, "list", params] as const)
			: NOTIFICATION_KEYS.all,
	details: () => [...NOTIFICATION_KEYS.all, "detail"] as const,
	detail: (id: string) => [...NOTIFICATION_KEYS.details(), id] as const,
};
