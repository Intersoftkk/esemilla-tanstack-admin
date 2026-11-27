// #/features/notifications/server/notifications.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { notificationSchema } from '#/features/notifications/schema/notifications-form.schema.ts'
import { notificationsListParamsSchema } from '#/features/notifications/schema/notifications-search.schema.ts'
import {
    createNotificationRequest,
    deleteNotificationRequest,
    fetchCompanies,
    fetchNotification,
    fetchNotifications,
    updateNotificationRequest,
} from '#/features/notifications/server/notifications.server.ts'

const notificationIdSchema = z.union([z.string(), z.number()]).transform(String)

const updateNotificationSchema = z.object({
    id: notificationIdSchema,
    payload: notificationSchema,
})

/** Server function: paginated notifications list. */
export const getNotificationsFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => notificationsListParamsSchema.parse(data ?? {}))
    .handler(async ({ data }) => fetchNotifications(data))

/** Server function: a single notification by ID. */
export const getNotificationFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => notificationIdSchema.parse(data))
    .handler(async ({ data: id }) => fetchNotification(id))

/** Server function: companies available for notification assignment. */
export const getCompaniesFn = createServerFn({ method: 'GET' }).handler(
    async () => fetchCompanies(),
)

/** Server function: create a notification. */
export const createNotificationFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => notificationSchema.parse(data))
    .handler(async ({ data }) => createNotificationRequest(data))

/** Server function: update a notification. */
export const updateNotificationFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => updateNotificationSchema.parse(data))
    .handler(async ({ data }) => updateNotificationRequest(data.id, data.payload))

/** Server function: delete a notification. */
export const deleteNotificationFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => notificationIdSchema.parse(data))
    .handler(async ({ data: id }) => deleteNotificationRequest(id))

/** Server function: delete several notifications in one request. */
export const deleteNotificationsFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => z.array(notificationIdSchema).min(1).parse(data))
    .handler(async ({ data: ids }) => {
        await Promise.all(ids.map((id) => deleteNotificationRequest(id)))
        return { deleted: ids.length }
    })
