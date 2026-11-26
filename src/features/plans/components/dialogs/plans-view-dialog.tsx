// #/features/plans/components/dialogs/plans-view-dialog.tsx
import { format, isValid, parseISO } from 'date-fns'
import { CalendarRange, Eye, Sparkles } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '#/components/ui/dialog'
import { planStatusOptions } from '#/features/plans/data/data.ts'
import { usePlanFeaturesQuery } from '#/features/plans/queries/plan.queries.ts'
import type { PlanRecord } from '#/features/plans/types/plans.ts'

interface Props {
    currentRow: PlanRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Formats a date string for display, falling back to the raw value. */
function formatDate(value?: string | null): string {
    if (!value) return '—'
    const date = parseISO(value)
    return isValid(date) ? format(date, 'dd MMM yyyy') : value
}

/** Renders the badge for a plan status. */
function getStatusBadge(status: PlanRecord['status']) {
    if (status === 'active') {
        return (
            <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">
                Active
            </Badge>
        )
    }

    const label =
        planStatusOptions.find((option) => option.value === status)?.label ??
        status

    if (status === 'archived') return <Badge variant="secondary">{label}</Badge>
    return <Badge variant="outline">{label}</Badge>
}

/** Read-only dialog showing the full plan record. */
export function PlansViewDialog({ currentRow, open, onOpenChange }: Props) {
    const featuresQuery = usePlanFeaturesQuery(currentRow?.id, open)
    const features = featuresQuery.data?.length
        ? featuresQuery.data
        : (currentRow?.features ?? [])

    if (!currentRow) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-inset ring-primary/15">
                            <Eye className="h-4 w-4 text-primary" />
                        </span>
                        Plan Details
                    </DialogTitle>
                    <DialogDescription>
                        View complete information about this plan.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background p-4">
                        <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
                        <div className="relative flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                    Plan name
                                </p>
                                <p className="mt-1 truncate text-lg font-semibold">
                                    {currentRow.name}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {currentRow.company?.name || 'No company'}
                                </p>
                            </div>
                            {getStatusBadge(currentRow.status)}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border bg-muted/20 p-3">
                            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                <CalendarRange className="h-3 w-3" />
                                Start date
                            </p>
                            <p className="font-medium tabular-nums">
                                {formatDate(currentRow.start_date)}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 p-3">
                            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                <CalendarRange className="h-3 w-3" />
                                End date
                            </p>
                            <p className="font-medium tabular-nums">
                                {formatDate(currentRow.end_date)}
                            </p>
                        </div>
                    </div>

                    {currentRow.description && (
                        <div className="rounded-lg border p-3">
                            <p className="mb-1 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                Description
                            </p>
                            <p className="text-sm leading-relaxed text-foreground">
                                {currentRow.description}
                            </p>
                        </div>
                    )}

                    <div className="rounded-lg border p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            <Sparkles className="h-3 w-3" />
                            Features
                        </p>
                        {features.length ? (
                            <div className="flex flex-wrap gap-1.5">
                                {features.map((feature) => (
                                    <Badge
                                        key={feature.id}
                                        variant="secondary"
                                        className="font-normal"
                                    >
                                        {feature.name}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No features attached to this plan.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
