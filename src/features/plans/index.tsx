// #/features/plans/index.tsx
import { CalendarRange, Sparkles } from 'lucide-react'

import { PageHeader } from '#/components/page-header.tsx'
import { Button } from '#/components/ui/button.tsx'
import { PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard'
import { PlansDialogs } from '#/features/plans/components/plans-dialogs.tsx'
import { PlansPrimaryButtons } from '#/features/plans/components/plans-primary-buttons.tsx'
import { PlansTable } from '#/features/plans/components/plans-table.tsx'
import PlansProvider, {
    usePlans,
} from '#/features/plans/context/plans-context.tsx'
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
            <PlansPageContent search={search} navigate={navigate} />
        </PlansProvider>
    )
}

/** Page body rendered inside the plans' provider. */
function PlansPageContent({ search, navigate }: PlansPageProps) {
    const { setOpen } = usePlans()

    return (
        <div className="space-y-6">
            <PageHeader
                title="Plans"
                description="Create and manage performance review plans across companies."
                icon={CalendarRange}
                iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
                actions={
                    <>
                        <PermissionGuard
                            permissions={[PERMISSIONS.CreatePlan]}
                        >
                            <PlansPrimaryButtons />
                        </PermissionGuard>
                        <PermissionGuard
                            permissions={[PERMISSIONS.ViewFeature]}
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

            <PlansTable search={search} navigate={navigate} />

            <PlansDialogs />
        </div>
    )
}
