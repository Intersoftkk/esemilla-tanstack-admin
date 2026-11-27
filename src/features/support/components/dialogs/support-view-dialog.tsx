// #/features/support/components/dialogs/support-view-dialog.tsx
import { format, isValid, parseISO } from 'date-fns'
import { CalendarRange, Eye, UserRound } from 'lucide-react'

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
import {
    supportPriorityOptions,
    supportStatusOptions,
} from '#/features/support/data/support.constant'
import type {
    SupportRecord,
    TicketPriority,
    TicketStatus,
} from '#/features/support/types/support.type.ts'

interface Props {
    currentRow: SupportRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

/** Formats a date string for display, falling back to the raw value. */
function formatDate(value?: string | null): string {
    if (!value) return '—'
    const date = parseISO(value)
    return isValid(date) ? format(date, 'dd MMM yyyy') : value
}

/** Renders the badge for a ticket status. */
function getStatusBadge(status: TicketStatus) {
    const label =
        supportStatusOptions.find((option) => option.value === status)?.label ??
        status

    if (status === 'resolved') {
        return (
            <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">
                {label}
            </Badge>
        )
    }

    if (status === 'closed') return <Badge variant="secondary">{label}</Badge>
    return <Badge variant="outline">{label}</Badge>
}

/** Renders the badge for a ticket priority. */
function getPriorityBadge(priority: TicketPriority) {
    const label =
        supportPriorityOptions.find((option) => option.value === priority)
            ?.label ?? priority

    if (priority === 'urgent' || priority === 'high') {
        return (
            <Badge className="bg-rose-500/10 text-rose-700 hover:bg-rose-500/10 dark:text-rose-400">
                {label}
            </Badge>
        )
    }

    return <Badge variant="outline">{label}</Badge>
}

/** Read-only dialog showing the full support ticket. */
export function SupportViewDialog({ currentRow, open, onOpenChange }: Props) {
    if (!currentRow) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-inset ring-primary/15">
                            <Eye className="h-4 w-4 text-primary" />
                        </span>
                        Ticket Details
                    </DialogTitle>
                    <DialogDescription>
                        View complete information about this support ticket.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background p-4">
                        <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
                        <div className="relative flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                    Subject
                                </p>
                                <p className="mt-1 truncate text-lg font-semibold">
                                    {currentRow.subject}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {currentRow.company?.name || 'No company'}
                                </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1.5">
                                {getStatusBadge(currentRow.status)}
                                {getPriorityBadge(currentRow.priority)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border bg-muted/20 p-3">
                            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                <CalendarRange className="h-3 w-3" />
                                Opened
                            </p>
                            <p className="font-medium tabular-nums">
                                {formatDate(currentRow.opened_at)}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-muted/20 p-3">
                            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                                <CalendarRange className="h-3 w-3" />
                                Closed
                            </p>
                            <p className="font-medium tabular-nums">
                                {formatDate(currentRow.closed_at)}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border p-3">
                        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            <UserRound className="h-3 w-3" />
                            Assignee
                        </p>
                        <p className="text-sm text-foreground">
                            {currentRow.assignee || 'Unassigned'}
                        </p>
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
