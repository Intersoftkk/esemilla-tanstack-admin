// #/features/subscriptions/subscriptions-page.tsx
import { CalendarRange, Sparkles } from 'lucide-react'

import { PageHeader } from '#/components/page-header.tsx'
import { Button } from '#/components/ui/button.tsx'
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard'
import { SubscriptionsDialogs } from '#/features/subscriptions/components/subscriptions-dialogs.tsx'
import { SubscriptionsPrimaryButtons } from '#/features/subscriptions/components/subscriptions-primary-buttons.tsx'
import { SubscriptionsTable } from '#/features/subscriptions/components/subscriptions-table.tsx'
import SubscriptionsProvider, {
    useSubscriptions,
} from '#/features/subscriptions/context/subscriptions-context.tsx'
import type { SubscriptionSearch } from '#/features/subscriptions/schema/subscriptions-search.schema.ts'
import type { NavigateFn } from '#/hooks/use-table-url-state'

interface SubscriptionsPageProps {
    search: SubscriptionSearch
    navigate: NavigateFn
}

/** Subscriptions page entry point. */
export default function SubscriptionsPage({ search, navigate }: SubscriptionsPageProps) {
    return (
        <SubscriptionsProvider>
            <SubscriptionsPageContent search={search} navigate={navigate} />
        </SubscriptionsProvider>
    )
}

/** Page body rendered inside the subscriptions' provider. */
function SubscriptionsPageContent({ search, navigate }: SubscriptionsPageProps) {
    const { setOpen } = useSubscriptions()

    return (
        <div className="space-y-6">
            <PageHeader
                title="Subscriptions"
                description="Create and manage tenant subscriptions and their billing cycle."
                icon={CalendarRange}
                iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
                actions={
                    <>
                        <PermissionGuard
                            permissions={[PLATFORM_PERMISSIONS.PlatformSubscriptionCreate]}
                        >
                            <SubscriptionsPrimaryButtons />
                        </PermissionGuard>
                        <PermissionGuard
                            permissions={[PLATFORM_PERMISSIONS.PlatformFeatureView]}
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOpen('feature-manager')}
                            >
                                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                Features
                            </Button>
                        </PermissionGuard>
                    </>
                }
            />

            <SubscriptionsTable search={search} navigate={navigate} />

            <SubscriptionsDialogs />
        </div>
    )
}
