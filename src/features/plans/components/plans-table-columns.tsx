// #/features/plans/components/plans-table-columns.tsx
import { format, parseISO, isValid } from 'date-fns'
import { createColumnHelper, type Column } from '@tanstack/react-table'

import { DataTableColumnHeader } from '#/components/datatable/data-table-column-header.tsx'
import { Badge } from '#/components/ui/badge'
import { Checkbox } from '#/components/ui/checkbox'
import { cn } from '#/lib/utils'
import type { plansTableFeatures } from '#/features/plans/config/plans.config.ts'
import { PlansTableRowActions } from '#/features/plans/components/plans-table-row-actions.tsx'
import type {
    PlanRecord,
    PlanStatus,
} from '#/features/plans/types/plans.ts'

type AnyColumn = Column<any, any, any>

/** Relaxes the column type for the shared datatable helpers. */
const asAnyColumn = (column: unknown): AnyColumn => column as AnyColumn

const columnHelper = createColumnHelper<
    typeof plansTableFeatures,
    PlanRecord
>()

/** Formats a date string for display, falling back to the raw value. */
function formatDate(value?: string | null): string {
    if (!value) return '—'
    const date = parseISO(value)
    return isValid(date) ? format(date, 'dd MMM yyyy') : value
}

const statusConfig: Record<
    PlanStatus,
    { label: string; className: string }
> = {
    draft: {
        label: 'Draft',
        className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    },
    active: {
        label: 'Active',
        className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    },
    completed: {
        label: 'Completed',
        className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    },
    archived: {
        label: 'Archived',
        className: 'bg-muted text-muted-foreground',
    },
}

/** Renders a compact, colour-coded status badge. */
function StatusBadge({ status }: { status: PlanStatus }) {
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

    columnHelper.accessor('name', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Plan Name"
            />
        ),
        cell: ({ row }) => (
            <div className="flex min-w-[240px] items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/10">
                    {row.original.name.charAt(0).toUpperCase()}
                </div>
                <div
                    className="max-w-xs truncate font-medium"
                    title={row.original.name}
                >
                    {row.original.name}
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
    }),

    columnHelper.accessor('description', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Description"
            />
        ),
        cell: ({ row }) => (
            <div
                className="max-w-xs truncate text-muted-foreground"
                title={row.original.description ?? ''}
            >
                {row.original.description || '—'}
            </div>
        ),
    }),

    columnHelper.accessor('start_date', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="Start Date"
            />
        ),
        cell: ({ row }) => (
            <div className="text-muted-foreground tabular-nums">
                {formatDate(row.original.start_date)}
            </div>
        ),
    }),

    columnHelper.accessor('end_date', {
        header: ({ column }) => (
            <DataTableColumnHeader
                column={asAnyColumn(column)}
                title="End Date"
            />
        ),
        cell: ({ row }) => (
            <div className="text-muted-foreground tabular-nums">
                {formatDate(row.original.end_date)}
            </div>
        ),
    }),

    columnHelper.accessor('status', {
        header: ({ column }) => (
            <DataTableColumnHeader column={asAnyColumn(column)} title="Status" />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    }),

    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => <PlansTableRowActions row={row} />,
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
