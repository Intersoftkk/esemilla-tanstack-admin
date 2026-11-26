import { format, parseISO } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { DataTableColumnHeader } from '@/components/datatable/data-table-column-header';
import {AppraisalCycleRecord} from "@/features/appraisal-cycle/types/appraisal-cycle";
import {
    AppraisalCycleTableRowActions
} from "@/features/appraisal-cycle/components/appraisal-cycle-table-row-actions.tsx";


export const columns: ColumnDef<AppraisalCycleRecord>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
            className: cn(
                'sticky left-0 z-10 rounded-tl',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
            ),
        },
    },

    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cycle Name" />
        ),
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="min-w-[240px]">
                    <div className="font-medium">{item.name}</div>
                </div>
            );
        },
        meta: {
            className: cn(
                'sticky left-6',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
            ),
        },
    },

    {
        accessorKey: 'company',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Company" />
        ),
        cell: ({ row }) => (
            <div className="max-w-md truncate">
                {row.original.company.name || '—'}
            </div>
        ),
    },

    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="max-w-md truncate">
                {row.original.description || '—'}
            </div>
        ),
    },

    {
        accessorKey: 'start_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ row }) => {
            const value = row.original.start_date;
            if (!value) return <div>—</div>;

            const date = parseISO(value);
            return <div>{format(date, 'dd MMM yyyy')}</div>;
        },
    },

    {
        accessorKey: 'end_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ row }) => {
            const value = row.original.end_date;
            if (!value) return <div>—</div>;

            const date = parseISO(value);
            return <div>{format(date, 'dd MMM yyyy')}</div>;
        },
    },

    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.original.status?.toLowerCase();

            switch (status) {
                case 'active':
                    return (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">
                            Active
                        </Badge>
                    );
                case 'completed':
                    return <Badge>Completed</Badge>;
                case 'archived':
                    return <Badge variant="secondary">Archived</Badge>;
                default:
                    return <Badge variant="outline">Draft</Badge>;
            }
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <AppraisalCycleTableRowActions row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
            className: cn(
                'sticky right-0',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
            ),
        },
    },
];
