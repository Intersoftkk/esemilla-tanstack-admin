// #/features/plans/index.tsx
import { CalendarRange } from 'lucide-react'

import { PageHeader } from '#/components/page-header.tsx'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard'
import { PlansDialogs } from '#/features/plans/components/plans-dialogs.tsx'
import { PlansPrimaryButtons } from '#/features/plans/components/plans-primary-buttons.tsx'
import { PlansTable } from '#/features/plans/components/plans-table.tsx'
import PlansProvider from '#/features/plans/context/plans-context.tsx'
import type { PlanSearch } from '#/features/plans/schema/plans-search.schema.ts'
import type { NavigateFn } from '#/hooks/use-table-url-state'

interface PlansPageProps {
    search: PlanSearch
    navigate: NavigateFn
}

/** Plans page entry point. */
export default function PlansPage({ search, navigate }: PlansPageProps) {
    return (
        <PlansProvider>
            <div className="space-y-6">
                <PageHeader
                    title="Plans"
                    description="Create and manage performance review plans across companies."
                    icon={CalendarRange}
                    actions={
                        <PermissionGuard
                            permissions={[PERMISSIONS.CreatePlan]}
                        >
                            <PlansPrimaryButtons />
                        </PermissionGuard>
                    }
                />

                <Card className="border shadow-xs">
                    <CardContent className="p-4">
                        <PlansTable search={search} navigate={navigate} />
                    </CardContent>
                </Card>

                <PlansDialogs />
            </div>
        </PlansProvider>
    )
}
