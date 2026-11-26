// #/features/plans/components/plans-stats.tsx
import { Archive, CalendarRange, CheckCircle2, Clock3 } from 'lucide-react'

import { Card, CardContent } from '#/components/ui/card.tsx'
import { Skeleton } from '#/components/ui/skeleton.tsx'
import { cn } from '#/lib/utils.ts'
import { countPlansByStatus } from '#/features/plans/utils/plans.utils.ts'
import type { PlanRecord } from '#/features/plans/types/plans.ts'

interface PlansStatsProps {
    plans: PlanRecord[]
    total: number
    isLoading: boolean
}

/** Stat cards give a quick overview of the plans list. */
export function PlansStats({ plans, total, isLoading }: PlansStatsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((slot) => (
                    <Card key={`plan-stat-${slot}`} size="sm">
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-7 w-12" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-xl" />
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
            accent: 'from-primary/70 via-primary/25 to-transparent',
        },
        {
            label: 'Active',
            value: counts.active,
            icon: CheckCircle2,
            tone: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-500/10',
            accent: 'from-emerald-500/70 via-emerald-500/25 to-transparent',
        },
        {
            label: 'Draft',
            value: counts.draft,
            icon: Clock3,
            tone: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-500/10',
            accent: 'from-amber-500/70 via-amber-500/25 to-transparent',
        },
        {
            label: 'Completed / archived',
            value: counts.completed + counts.archived,
            icon: Archive,
            tone: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-500/10',
            accent: 'from-blue-500/70 via-blue-500/25 to-transparent',
        },
    ]

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <Card
                    key={item.label}
                    size="sm"
                    className="relative overflow-hidden shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                    <div
                        className={cn(
                            'absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r',
                            item.accent,
                        )}
                    />
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                            <p className="truncate text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                {item.label}
                            </p>
                            <p className="mt-1 text-2xl leading-none font-semibold tracking-tight tabular-nums">
                                {item.value}
                            </p>
                        </div>
                        <div
                            className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-foreground/5',
                                item.bg,
                            )}
                        >
                            <item.icon className={cn('h-4 w-4', item.tone)} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
