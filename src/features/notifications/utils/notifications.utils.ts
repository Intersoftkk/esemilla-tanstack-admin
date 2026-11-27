// #/features/notifications/utils/notifications.utils.ts
import { saveBlob } from '#/lib/download.ts'
import type { NotificationRecord, NotificationStatus } from '#/features/notifications/types/notifications.type.ts'

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
    const text = value === null || value === undefined ? '' : String(value)
    return `"${text.replaceAll('"', '""')}"`
}

/** Converts notifications into a CSV document with a header row. */
export function notificationsToCsv(notifications: NotificationRecord[]): string {
    const header = [
        'ID',
        'Name',
        'Company',
        'Description',
        'Start Date',
        'End Date',
        'Status',
    ]
        .map(escapeCsv)
        .join(',')

    const rows = notifications.map((notification) =>
        [
            notification.id,
            notification.name,
            notification.company?.name ?? '',
            notification.description ?? '',
            notification.start_date ?? '',
            notification.end_date ?? '',
            notification.status,
        ]
            .map(escapeCsv)
            .join(','),
    )

    return [header, ...rows].join('\r\n')
}

/** Downloads the visible notifications as a CSV file. */
export function downloadNotificationsCsv(notifications: NotificationRecord[]): void {
    saveBlob(
        new Blob([notificationsToCsv(notifications)], { type: 'text/csv;charset=utf-8;' }),
        `notifications-${new Date().toISOString().slice(0, 10)}.csv`,
    )
}

/** Counts notifications per status for the summary cards. */
export function countNotificationsByStatus(
    notifications: NotificationRecord[],
): Record<NotificationStatus, number> {
    const counts: Record<NotificationStatus, number> = {
        draft: 0,
        active: 0,
        completed: 0,
        archived: 0,
    }

    for (const notification of notifications) counts[notification.status] += 1
    return counts
}
