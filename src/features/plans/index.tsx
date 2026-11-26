// #/features/plans/index.tsx
import type { NavigateFn } from '#/hooks/use-table-url-state'
import { PERMISSIONS } from '#/config/permissions.config'
import { PermissionGuard } from '#/features/auth/components/permission-guard'
import { PlansDialogs } from '#/features/plans/components/plans-dialogs.tsx'
import { PlansPrimaryButtons } from '#/features/plans/components/plans-primary-buttons.tsx'
import { PlansTable } from '#/features/plans/components/plans-table.tsx'
import PlansProvider from '#/features/plans/context/plans-context.tsx'
import type { PlanSearch } from '#/features/plans/schema/plans-search.schema.ts'

interface PlansPageProps {
    search: PlanSearch
    navigate: NavigateFn
}

/** Plans page entry point. */
export default function PlansPage({ search, navigate }: PlansPageProps) {
    return (
        <PlansProvider>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Plans</h2>
                    <p className="text-muted-foreground">
                        Manage your plans.
                    </p>
                </div>

                <PermissionGuard
                    permissions={[PERMISSIONS.CreatePerformanceCycle]}
                >
                    <PlansPrimaryButtons />
                </PermissionGuard>
            </div>

            <div className="flex-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <PlansTable search={search} navigate={navigate} />
            </div>

            <PlansDialogs />
        </PlansProvider>
    )
}
