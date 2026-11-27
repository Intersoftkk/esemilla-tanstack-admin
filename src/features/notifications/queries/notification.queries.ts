// #/features/notifications/queries/notification.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { NOTIFICATION_KEYS } from '#/features/notifications/queries/notification.keys.ts'
import type { NotificationFormData } from '#/features/notifications/schema/notifications-form.schema.ts'
import type { NotificationsListParams } from '#/features/notifications/schema/notifications-search.schema.ts'
import {
    createNotification,
    deleteNotification,
    deleteNotifications,
    fetchCompanies,
    fetchPaginatedNotifications,
    updateNotification,
} from '#/features/notifications/service/notifications.service.ts'

interface NotificationMutationOptions {
    /** Called after the cache has been invalidated and the toast shown. */
    onSuccess?: () => void
}

/** Returns an error message suitable for a toast. */
function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback
}

/** Paginated notifications list, keyed by the current table state. */
export function useNotificationsPaginateQuery(params: NotificationsListParams) {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.lists(params),
        queryFn: () => fetchPaginatedNotifications(params),
    })
}

/** Companies available for assignment when creating or editing a notification. */
export function useCompaniesQuery() {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.companies(),
        queryFn: fetchCompanies,
        staleTime: 1000 * 60 * 5,
    })
}

/** Creates a notification. */
export function useCreateNotificationMutation(options?: NotificationMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: NotificationFormData) => createNotification(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all })
            toast.success('Notification created successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not create notification.')),
    })
}

/** Updates an existing notification. */
export function useUpdateNotificationMutation(options?: NotificationMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: NotificationFormData }) =>
            updateNotification(id, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all })
            toast.success('Notification updated successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not update notification.')),
    })
}

/** Deletes a single notification. */
export function useDeleteNotificationMutation(options?: NotificationMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all })
            toast.success('Notification deleted successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete notification.')),
    })
}

/** Deletes the selected notifications in one batch. */
export function useDeleteNotificationsMutation(options?: NotificationMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => deleteNotifications(ids),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all })
            toast.success('Selected notifications deleted successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete notifications.')),
    })
}
