// #/features/plans/components/plans-stats.tsx
import { Archive, CalendarRange, CheckCircle2, Clock3 } from 'lucide-react'

import { Card, CardContent } from '#/components/ui/card.tsx'
import { Skeleton } from '#/components/ui/skeleton.tsx'
import { countPlansByStatus } from '#/features/plans/utils/plans.utils.ts'
import type { PlanRecord } from '#/features/plans/types/plans.ts'

interface PlansStatsProps {
    plans: PlanRecord[]
    total: number
    isLoading: boolean
}

/** Summary cards for the plans list. */
export function PlansStats({ plans, total, isLoading }: PlansStatsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((slot) => (
                    <Card key={`plan-stat-${slot}`} size="sm">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                            <Skeleton className="h-9 w-9 rounded-lg" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const counts = countPlansByStatus(plans)
    const items = [
        {
            label: 'Total plans',
            value: total,
            icon: CalendarRange,
            tone: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            label: 'Active',
            value: counts.active,
            icon: CheckCircle2,
            tone: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            label: 'Draft',
            value: counts.draft,
            icon: Clock3,
            tone: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-500/10',
        },
        {
            label: 'Completed / archived',
            value: counts.completed + counts.archived,
            icon: Archive,
            tone: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-500/10',
        },
    ]

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <Card key={item.label} size="sm" className="shadow-xs">
                    <CardContent className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="mt-1 text-lg font-semibold tabular-nums">
                                {item.value}
                            </p>
                        </div>
                        <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}
                        >
                            <item.icon className={`h-4 w-4 ${item.tone}`} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
