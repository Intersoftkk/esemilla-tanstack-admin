// #/features/plans/components/plans-table-columns.tsx
import { format, parseISO, isValid } from 'date-fns'
import { createColumnHelper, type Column } from '@tanstack/react-table'

import { Badge } from '#/components/ui/badge'
import { Checkbox } from '#/components/ui/checkbox'
import { DataTableColumnHeader } from '#/components/datatable/data-table-column-header'
import { cn } from '#/lib/utils'
import type { plansTableFeatures } from '#/features/plans/config/plans.config.ts'
import { PlansTableRowActions } from '#/features/plans/components/plans-table-row-actions.tsx'
import type { PlanRecord } from '#/features/plans/types/plans.ts'

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
            <DataTableColumnHeader column={asAnyColumn(column)} title="Plan Name" />
        ),
        cell: ({ row }) => (
            <div className="min-w-[240px] font-medium">{row.original.name}</div>
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
            <DataTableColumnHeader column={asAnyColumn(column)} title="Company" />
        ),
        cell: ({ row }) => (
            <div className="max-w-md truncate">
                {row.original.company?.name || '—'}
            </div>
        ),
    }),

    columnHelper.accessor('description', {
        header: ({ column }) => (
            <DataTableColumnHeader column={asAnyColumn(column)} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="max-w-md truncate">
                {row.original.description || '—'}
            </div>
        ),
    }),

    columnHelper.accessor('start_date', {
        header: ({ column }) => (
            <DataTableColumnHeader column={asAnyColumn(column)} title="Start Date" />
        ),
        cell: ({ row }) => <div>{formatDate(row.original.start_date)}</div>,
    }),

    columnHelper.accessor('end_date', {
        header: ({ column }) => (
            <DataTableColumnHeader column={asAnyColumn(column)} title="End Date" />
        ),
        cell: ({ row }) => <div>{formatDate(row.original.end_date)}</div>,
    }),

    columnHelper.accessor('status', {
        header: ({ column }) => (
            <DataTableColumnHeader column={asAnyColumn(column)} title="Status" />
        ),
        cell: ({ row }) => {
            switch (row.original.status) {
                case 'active':
                    return (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">
                            Active
                        </Badge>
                    )
                case 'completed':
                    return <Badge>Completed</Badge>
                case 'archived':
                    return <Badge variant="secondary">Archived</Badge>
                default:
                    return <Badge variant="outline">Draft</Badge>
            }
        },
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
