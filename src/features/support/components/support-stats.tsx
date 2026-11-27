// #/features/support/components/support-stats.tsx
import { CheckCircle2, Clock3, Ticket, Timer } from 'lucide-react'

import { Card, CardContent } from '#/components/ui/card.tsx'
import { Skeleton } from '#/components/ui/skeleton.tsx'
import { cn } from '#/lib/utils.ts'
import { countSupportByStatus } from '#/features/support/utils/support.utils.ts'
import type { SupportRecord } from '#/features/support/types/support.ts'

interface SupportStatsProps {
    support: SupportRecord[]
    total: number
    isLoading: boolean
}

/** Stat cards give a quick overview of the support ticket queue. */
export function SupportStats({ support, total, isLoading }: SupportStatsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((slot) => (
                    <Card key={`support-stat-${slot}`} size="sm">
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

    const counts = countSupportByStatus(support)
    const items = [
        {
            label: 'Total tickets',
            value: total,
            icon: Ticket,
        },
        {
            label: 'Open',
            value: counts.open,
            icon: Timer,
        },
        {
            label: 'Pending',
            value: counts.pending,
            icon: Clock3,
        },
        {
            label: 'Resolved / closed',
            value: counts.resolved + counts.closed,
            icon: CheckCircle2,
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
                        className={cn('absolute inset-x-0 top-0 h-0.5 bg-linear-to-r')}
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
                            )}
                        >
                            <item.icon className={cn('h-4 w-4')} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
