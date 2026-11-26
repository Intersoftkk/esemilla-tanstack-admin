// #/features/plans/components/dialogs/plans-view-dialog.tsx
import { format, isValid, parseISO } from 'date-fns'
import { Eye } from 'lucide-react'

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
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">
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
    if (!currentRow) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <Eye className="h-5 w-5" />
                        Plan Details
                    </DialogTitle>
                    <DialogDescription>
                        View complete information about this plan.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div>
                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                PLAN NAME
                            </p>
                            <p className="text-lg font-semibold">{currentRow.name}</p>
                        </div>

                        <div>
                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                COMPANY
                            </p>
                            <p className="font-medium">
                                {currentRow.company?.name || '—'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="mb-1 text-xs font-medium text-muted-foreground">
                                    START DATE
                                </p>
                                <p className="font-medium">
                                    {formatDate(currentRow.start_date)}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-medium text-muted-foreground">
                                    END DATE
                                </p>
                                <p className="font-medium">
                                    {formatDate(currentRow.end_date)}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                STATUS
                            </p>
                            {getStatusBadge(currentRow.status)}
                        </div>
                    </div>

                    {currentRow.description && (
                        <div>
                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                DESCRIPTION
                            </p>
                            <p className="text-sm leading-relaxed text-foreground">
                                {currentRow.description}
                            </p>
                        </div>
                    )}
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
