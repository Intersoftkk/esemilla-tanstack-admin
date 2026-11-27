// #/features/notifications/server/notifications.server.ts
import { buildQueryParams } from '#/lib/query-builder.ts'
import {
    asRecord,
    readText,
    unwrapEntity,
    unwrapList,
} from '#/lib/payload.ts'
import type { PaginatedResponse } from '#/types'
import { api } from '#/server/api.server.ts'

import type { NotificationsListParams } from '#/features/notifications/schema/notifications-search.schema.ts'
import type { NotificationFormData } from '#/features/notifications/schema/notifications-form.schema.ts'
import type {
    CompanyOption,
    NotificationRecord,
    NotificationStatus,
} from '#/features/notifications/types/notifications.ts'

// Laravel API resource for notifications.
const RESOURCE = '/notifications'

const NOTIFICATION_STATUSES: NotificationStatus[] = [
    'draft',
    'active',
    'completed',
    'archived',
]

/** Maps an API status value onto the notification status union. */
function normalizeStatus(value: unknown): NotificationStatus {
    const status = readText(value)?.toLowerCase()
    return NOTIFICATION_STATUSES.find((item) => item === status) ?? 'draft'
}

/** Normalizes an API payload into a notification record. */
export function normalizeNotification(value: unknown): NotificationRecord | null {
    const record = asRecord(value)
    const id = readText(record.id, record.uuid)
    if (!id) return null

    const company = asRecord(record.company)

    return {
        id,
        company_id:
            readText(record.company_id, record.companyId) ??
            readText(company.id) ??
            '',
        company: Object.keys(company).length
            ? {
                  id: readText(company.id) ?? '',
                  name: readText(company.name),
              }
            : null,
        name: readText(record.name) ?? 'Untitled notification',
        description: readText(record.description),
        start_date: readText(record.start_date, record.startDate),
        end_date: readText(record.end_date, record.endDate),
        status: normalizeStatus(record.status),
    }
}

/** Normalizes an API payload into a company option. */
function normalizeCompany(value: unknown): CompanyOption | null {
    const record = asRecord(value)
    const id = readText(record.id, record.uuid)
    if (!id) return null
    return { id, name: readText(record.name) }
}

/** Fetches a paginated list of notifications from the backend. */
export async function fetchNotifications(
    params: NotificationsListParams,
): Promise<PaginatedResponse<NotificationRecord>> {
    const queryString = buildQueryParams({
        sorting: params.sorting,
        filters: params.filters,
        pagination: params.pagination,
    })

    const { data } = await api.get<unknown>(
        `${RESOURCE}${queryString ? `?${queryString}` : ''}`,
    )

    const root = asRecord(data)
    const envelope = asRecord(root.data)
    const payload = Object.keys(envelope).length ? envelope : root
    const records = unwrapList(payload)
        .map(normalizeNotification)
        .filter((item): item is NotificationRecord => item !== null)

    const total = Number(payload.total ?? records.length)
    const perPage = Number(payload.per_page ?? params.pagination?.pageSize ?? 10)
    const currentPage = Number(payload.current_page ?? 1)

    return {
        current_page: currentPage,
        from: Number(payload.from ?? 0),
        last_page: Number(
            payload.last_page ?? Math.ceil(total / Math.max(perPage, 1)),
        ),
        links: Array.isArray(payload.links) ? payload.links : [],
        path: readText(payload.path) ?? RESOURCE,
        per_page: perPage,
        to: Number(payload.to ?? 0),
        total,
        data: records,
    }
}

/** Fetches a single notification by ID. */
export async function fetchNotification(id: string): Promise<NotificationRecord> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
    )
    const notification = normalizeNotification(unwrapEntity(data) ?? data)
    if (!notification) throw new Error('Notification record could not be parsed.')
    return notification
}

/** Creates a notification in the backend. */
export async function createNotificationRequest(
    payload: NotificationFormData,
): Promise<NotificationRecord> {
    const { data } = await api.post<unknown>(RESOURCE, payload)
    const notification = normalizeNotification(unwrapEntity(data) ?? data)
    if (!notification) throw new Error('Created notification could not be parsed.')
    return notification
}

/** Updates an existing notification in the backend. */
export async function updateNotificationRequest(
    id: string,
    payload: NotificationFormData,
): Promise<NotificationRecord> {
    const { data } = await api.put<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        payload,
    )
    const notification = normalizeNotification(unwrapEntity(data) ?? data)
    if (!notification) throw new Error('Updated notification could not be parsed.')
    return notification
}

/** Deletes a notification from the backend. */
export async function deleteNotificationRequest(id: string): Promise<void> {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
}

/** Fetches companies available for notification assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
    try {
        const { data } = await api.get<unknown>('/companies', {
            params: { per_page: 100 },
        })
        return unwrapList(data)
            .map(normalizeCompany)
            .filter((item): item is CompanyOption => item !== null)
    } catch (error) {
        console.error('Failed to load companies for notifications:', error)
        return []
    }
}
