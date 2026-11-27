// #/features/notifications/notifications-page.tsx
import { Bell } from 'lucide-react'

import { PageHeader } from '#/components/page-header.tsx'
import { NotificationsDialogs } from '#/features/notifications/components/notifications-dialogs.tsx'
import { NotificationsPrimaryButtons } from '#/features/notifications/components/notifications-primary-buttons.tsx'
import { NotificationsTable } from '#/features/notifications/components/notifications-table.tsx'
import NotificationsProvider from '#/features/notifications/context/notifications-context.tsx'
import type { NotificationSearch } from '#/features/notifications/schema/notifications-search.schema.ts'
import type { NavigateFn } from '#/hooks/use-table-url-state'

interface NotificationsPageProps {
    search: NotificationSearch
    navigate: NavigateFn
}

/** Notifications page entry point. */
export default function NotificationsPage({ search, navigate }: NotificationsPageProps) {
    return (
        <NotificationsProvider>
            <NotificationsPageContent search={search} navigate={navigate} />
        </NotificationsProvider>
    )
}

/** Page body rendered inside the notifications' provider. */
function NotificationsPageContent({ search, navigate }: NotificationsPageProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Notifications"
                description="Notifications delivered to platform users and tenants."
                icon={Bell}
                iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
                actions={
                    <>
                        <NotificationsPrimaryButtons />
                    </>
                }
            />

            <NotificationsTable search={search} navigate={navigate} />

            <NotificationsDialogs />
        </div>
    )
}
