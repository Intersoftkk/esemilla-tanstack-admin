import type {QueryParams} from '@/types'
import type {NotificationRecord} from '@/types/notification'
import api from '@/lib/axios'
import {buildQueryParams} from '@/lib/query-builder'

// Fetch all notifications (no pagination)
export async function fetchNotifications(
    params: QueryParams,
): Promise<Array<NotificationRecord>> {
    const queryString = buildQueryParams(params)
    const {data} = await api.get(`/notifications?${queryString.toString()}`)
    return data
}

// Get single notification
export async function getNotification(id: string): Promise<NotificationRecord> {
    const {data} = await api.get<NotificationRecord>(`/notifications/${id}`)
    return data
}

// Mark as read
export async function markNotificationAsRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/read`)
}

// Mark all as read
export async function markAllNotificationsAsRead(): Promise<void> {
    await api.post(`/notifications/read-all`)
}

// Delete notification
export async function deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`)
}
