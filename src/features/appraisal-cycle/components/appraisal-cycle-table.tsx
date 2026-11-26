import { useState } from 'react'
import type {
    PaginationState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table'
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import DataTableSkeleton from '@/components/datatable/data-table-skeleton'
import { DataTablePaginationSkeleton } from '@/components/datatable/data-table-pagination-skeleton'
import { DataTablePagination } from '@/components/datatable/data-table-pagination'
import { useDebounce } from '@/hooks/use-debounce'
import { filterFns } from '@/utils/table-filters'
import { sortToState, stateToSort } from '@/lib/nuqs-parsers'

import { columns } from '@/features/appraisal-cycle/components/appraisal-cycle-table-columns'
import { AppraisalCycleTableToolbar } from '@/features/appraisal-cycle/components/appraisal-cycle-table-toolbar'
import { fetchPaginatedAppraisalCycles } from '@/features/appraisal-cycle/service/appraisal-cycle.service'
import {
    AppraisalCycleFilters,
    AppraisalCycleSearch,
    EMPTY_APPRAISAL_CYCLE_FILTERS,
} from '@/features/appraisal-cycle/schema/appraisal-cycle-search.schema'
import type { NavigateFn } from '@/hooks/use-table-url-state'

type Props = {
    search: AppraisalCycleSearch
    navigate: NavigateFn
}

export function AppraisalCycleTable({ search, navigate }: Props) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: Math.max(0, (search.pageIndex ?? 1) - 1),
        pageSize: search.pageSize ?? 10,
    })

    const [sorting, setSorting] = useState<SortingState>(
        sortToState(search.sort ?? [])
    )

    const [filters, setFilters] = useState<AppraisalCycleFilters>({
        ...EMPTY_APPRAISAL_CYCLE_FILTERS,
        search: search.search ?? '',
        created_by_ids: search.created_by_ids ?? [],
        status: search.status ?? [],
    })

    const debouncedFilters = useDebounce(filters, 500)

    const queryKey = ['appraisal-cycles', sorting, debouncedFilters, pagination]

    const { data: tableData, isLoading } = useQuery({
        queryKey,
        queryFn: () =>
            fetchPaginatedAppraisalCycles({
                sorting,
                filters: debouncedFilters,
                pagination,
            }),
    })

    const syncSearch = (patch: Partial<AppraisalCycleSearch>) =>
        navigate({
            search: (prev) => ({
                ...prev,
                ...patch,
            }),
        })

    const onChangeFilters = (patch: Partial<AppraisalCycleFilters>) => {
        const next = { ...filters, ...patch }
        setFilters(next)
        setPagination((p) => ({ ...p, pageIndex: 0 }))

        syncSearch({
            ...next,
            pageIndex: 1,
        })
    }

    const onPaginationChange = (next: PaginationState) => {
        setPagination(next)
        syncSearch({
            pageIndex: next.pageIndex + 1,
            pageSize: next.pageSize,
        })
    }

    const onSortingChange = (next: SortingState) => {
        setSorting(next)
        syncSearch({
            sort: stateToSort(next),
        })
    }

    const table = useReactTable({
        filterFns,
        data: tableData?.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),

        onSortingChange: (updater) => {
            const next = typeof updater === 'function' ? updater(sorting) : updater
            onSortingChange(next)
        },
        enableMultiSort: true,
        manualSorting: true,
        sortDescFirst: true,

        manualFiltering: true,

        onPaginationChange: (updater) => {
            const next =
                typeof updater === 'function' ? updater(pagination) : updater
            onPaginationChange(next)
        },
        manualPagination: true,
        pageCount:
            tableData?.last_page ??
            Math.ceil((tableData?.total ?? 0) / (tableData?.per_page || 1)),
        rowCount: tableData?.total ?? 0,

        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,

        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),

        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })

    return (
        <div className="space-y-4">
            <AppraisalCycleTableToolbar
                table={table}
                filters={filters}
                onChangeFilters={onChangeFilters}
            />

            {isLoading ? (
                <DataTableSkeleton
                    columns={table.getAllColumns()}
                    rowCount={pagination.pageSize}
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="group/row">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={header.column.columnDef.meta?.className ?? ''}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className="group/row"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={cell.column.columnDef.meta?.className ?? ''}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No appraisal cycles found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {isLoading ? (
                <DataTablePaginationSkeleton />
            ) : (
                <DataTablePagination table={table} />
            )}
        </div>
    )
}
