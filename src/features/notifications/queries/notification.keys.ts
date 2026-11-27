// #/features/notifications/queries/notification.keys.ts

export const NOTIFICATION_KEYS = {
    all: ['notifications'] as const,
    /** Keys for paginated notification lists. */
    lists: (params?: Record<string, unknown>) =>
        [...NOTIFICATION_KEYS.all, 'lists', params ?? {}] as const,
    /** Key for a single (unpaginated) notification list. */
    list: (params?: Record<string, unknown>) =>
        [...NOTIFICATION_KEYS.all, 'list', params ?? {}] as const,
    /** Base key for notification details. */
    details: () => [...NOTIFICATION_KEYS.all, 'detail'] as const,
    /** Key for a single notification detail. */
    detail: (id: string | number) =>
        [...NOTIFICATION_KEYS.details(), String(id)] as const,
    /** Key for the companies available to notifications. */
    companies: () => [...NOTIFICATION_KEYS.all, 'companies'] as const,
}
