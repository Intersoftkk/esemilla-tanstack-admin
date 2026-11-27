// #/features/support/components/support-table-columns.tsx
import { format, isValid, parseISO } from 'date-fns'
import { createColumnHelper, type Column } from '@tanstack/react-table'

import { DataTableColumnHeader } from '#/components/datatable/data-table-column-header.tsx'
import { Badge } from '#/components/ui/badge'
import { Checkbox } from '#/components/ui/checkbox'
import { cn } from '#/lib/utils'
import type { supportTableFeatures } from '#/features/support/config/support.config.ts'
import { SupportTableRowActions } from '#/features/support/components/support-table-row-actions.tsx'
import type {
    SupportRecord,
    TicketPriority,
    TicketStatus,
} from '#/features/support/types/support.ts'

type AnyColumn = Column<any, any, any>

/** Relaxes the column type for the shared datatable helpers. */
const asAnyColumn = (column: unknown): AnyColumn => column as AnyColumn

const columnHelper = createColumnHelper<
    typeof supportTableFeatures,
    SupportRecord
>()

/** Formats a date string for display, falling back to the raw value. */
function formatDate(value?: string | null): string {
    if (!value) return '—'
    const date = parseISO(value)
    return isValid(date) ? format(date, 'dd MMM yyyy') : value
}

const statusConfig: Record<
    TicketStatus,
    { label: string; className: string }
> = {
    open: {
        label: 'Open',
        className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    },
    pending: {
        label: 'Pending',
        className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    },
    resolved: {
        label: 'Resolved',
        className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    },
    closed: {
        label: 'Closed',
        className: 'bg-muted text-muted-foreground',
    },
}

const priorityConfig: Record<
    TicketPriority,
    { label: string; className: string }
> = {
    urgent: {
        label: 'Urgent',
        className: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
    },
    high: {
        label: 'High',
        className: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    },
    normal: {
        label: 'Normal',
        className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
    },
    low: {
        label: 'Low',
        className: 'bg-muted text-muted-foreground',
    },
}

/** Renders a compact, colour-coded ticket status badge. */
function StatusBadge({ status }: { status: TicketStatus }) {
    const config = statusConfig[status]

    return (
        <Badge
            variant="outline"
            className={cn('gap-1.5 border-transparent', config.className)}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {config.label}
        </Badge>
    )
}

/** Renders a compact, colour-coded ticket priority badge. */
function PriorityBadge({ priority }: { priority: TicketPriority }) {
    const config = priorityConfig[priority]

    return (
        <Badge
            variant="outline"
            className={cn('border-transparent', config.className)}
        >
            {config.label}
        </Badge>
    )
}

export const columns = columnHelper.columns([
    columnHelper.display({
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() &&
                        !table.getIsAllPageRowsSelected() &&
                        'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(Boolean(value))
                }
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
            className: cn(
                'sticky left-0 z-10 rounded-tl',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
            ),
        },
    }),

    columnHelper.accessor('subject', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Subject"
            />
        ),
        cell: ({ row }) => (
            <div className="flex min-w-[240px] items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/10">
                    {row.original.subject.charAt(0).toUpperCase()}
                </div>
                <div
                    className="max-w-xs truncate font-medium"
                    title={row.original.subject}
                >
                    {row.original.subject}
                </div>
            </div>
        ),
        meta: {
            className: cn(
                'sticky left-6',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
            ),
        },
    }),

    columnHelper.accessor('company', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Company"
            />
        ),
        cell: ({ row }) => (
            <div
                className="max-w-40 truncate text-muted-foreground"
                title={row.original.company?.name ?? ''}
            >
                {row.original.company?.name || '—'}
            </div>
        ),
        enableSorting: false,
    }),

    columnHelper.accessor('priority', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Priority"
            />
        ),
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    }),

    columnHelper.accessor('status', {
        header: ({ column }) => (
            <DataTableColumnHeader column={asAnyColumn(column)} title="Status" />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    }),

    columnHelper.accessor('assignee', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Assignee"
            />
        ),
        cell: ({ row }) => (
            <div className="max-w-40 truncate text-muted-foreground">
                {row.original.assignee || 'Unassigned'}
            </div>
        ),
    }),

    columnHelper.accessor('opened_at', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Opened"
            />
        ),
        cell: ({ row }) => (
            <div className="text-muted-foreground tabular-nums">
                {formatDate(row.original.opened_at)}
            </div>
        ),
    }),

    columnHelper.accessor('closed_at', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Closed"
            />
        ),
        cell: ({ row }) => (
            <div className="text-muted-foreground tabular-nums">
                {formatDate(row.original.closed_at)}
            </div>
        ),
    }),

    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => <SupportTableRowActions row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
            className: cn(
                'sticky right-0',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
            ),
        },
    }),
])
