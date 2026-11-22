import {
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { NOTIFICATION_KEYS } from "#/features/notification/queries/notification.keys.ts";
import type { NotificationSearchInput } from "#/features/notification/schema/notification-search.schema.ts";
import {
	deleteNotificationFn,
	getNotificationByIdFn,
	getNotificationsFn,
	markAllNotificationsReadFn,
	markNotificationReadFn,
} from "#/features/notification/server/notification.functions.ts";
import type {
	NotificationRecord,
	NotificationsResponse,
} from "#/features/notification/types/notification.ts";

type QueryOptions<TData> = Omit<
	UseQueryOptions<NotificationsResponse, Error, TData>,
	"queryKey" | "queryFn"
> & {
	params?: NotificationSearchInput;
};

function errorMessage(error: unknown, fallback: string): string {
	if (error instanceof Error && error.message) return error.message;
	return fallback;
}

export function useNotificationsQuery<T = NotificationsResponse>(
	opts?: QueryOptions<T>,
) {
	const { params, ...queryOpts } = opts ?? {};
	const fetchNotifications = useServerFn(getNotificationsFn);

	return useQuery({
		queryKey: NOTIFICATION_KEYS.list(params),
		queryFn: () => fetchNotifications({ data: params }),
		staleTime: 1000 * 60 * 2,
		...queryOpts,
	});
}

export function useNotificationQuery(id: string, enabled = true) {
	const fetchNotification = useServerFn(getNotificationByIdFn);

	return useQuery<NotificationRecord>({
		queryKey: NOTIFICATION_KEYS.detail(id),
		queryFn: () => fetchNotification({ data: id }),
		enabled: Boolean(id) && enabled,
		staleTime: 1000 * 60 * 5,
	});
}

export function useMarkNotificationReadMutation() {
	const queryClient = useQueryClient();
	const markSingleAsRead = useServerFn(markNotificationReadFn);

	return useMutation({
		mutationFn: async (id: string) => await markSingleAsRead({ data: id }),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });
			const previous = queryClient.getQueryData<NotificationsResponse>(
				NOTIFICATION_KEYS.all,
			);
			queryClient.setQueryData<NotificationsResponse>(
				NOTIFICATION_KEYS.all,
				(old) => {
					if (!old) return old;
					return {
						...old,
						unread_count: Math.max(0, old.unread_count - 1),
						data: old.data.map((item) =>
							item.id === id
								? { ...item, read_at: item.read_at ?? new Date().toISOString() }
								: item,
						),
					};
				},
			);
			return { previous };
		},
		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(NOTIFICATION_KEYS.all, context.previous);
			}
			toast.error(
				errorMessage(err, "Could not mark the notification as read."),
			);
		},
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
		},
	});
}

export function useMarkAllNotificationsReadMutation() {
	const queryClient = useQueryClient();
	const markAllAsRead = useServerFn(markAllNotificationsReadFn);

	return useMutation({
		mutationFn: async () => await markAllAsRead(),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });
			const previous = queryClient.getQueryData<NotificationsResponse>(
				NOTIFICATION_KEYS.all,
			);
			queryClient.setQueryData<NotificationsResponse>(
				NOTIFICATION_KEYS.all,
				(old) => {
					if (!old) return old;
					return {
						...old,
						unread_count: 0,
						data: old.data.map((item) => ({
							...item,
							read_at: item.read_at ?? new Date().toISOString(),
						})),
					};
				},
			);
			return { previous };
		},
		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(NOTIFICATION_KEYS.all, context.previous);
			}
			toast.error(errorMessage(err, "Could not mark all as read."));
		},
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
		},
	});
}

export function useDeleteNotificationMutation() {
	const queryClient = useQueryClient();
	const removeNotification = useServerFn(deleteNotificationFn);

	return useMutation({
		mutationFn: async (id: string) => await removeNotification({ data: id }),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });
			const previous = queryClient.getQueryData<NotificationsResponse>(
				NOTIFICATION_KEYS.all,
			);
			queryClient.setQueryData<NotificationsResponse>(
				NOTIFICATION_KEYS.all,
				(old) => {
					if (!old) return old;
					const removed = old.data.find((item) => item.id === id);
					return {
						...old,
						unread_count:
							removed && !removed.read_at
								? Math.max(0, old.unread_count - 1)
								: old.unread_count,
						data: old.data.filter((item) => item.id !== id),
					};
				},
			);
			return { previous };
		},
		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(NOTIFICATION_KEYS.all, context.previous);
			}
			toast.error(errorMessage(err, "Could not delete the notification."));
		},
		onSuccess: () => toast.success("Notification deleted."),
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
		},
	});
}
