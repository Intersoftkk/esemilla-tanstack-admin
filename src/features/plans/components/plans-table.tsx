// #/features/plans/components/plans-table.tsx
import { useState } from 'react'
import {
    useTable,
    type ColumnVisibilityState,
    type PaginationState,
    type SortingState,
    type Table as TableInstance,
    type Column,
} from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'

import { DataTablePagination } from '#/components/datatable/data-table-pagination'
import DataTableSkeleton from '#/components/datatable/data-table-skeleton'
import { DataTablePaginationSkeleton } from '#/components/datatable/data-table-pagination-skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '#/components/ui/table'
import { useDebounce } from '#/hooks/use-debounce'
import type { NavigateFn } from '#/hooks/use-table-url-state'
import { parseAsSpatieSort } from '#/lib/nuqs-parsers'
import { columns } from '#/features/plans/components/plans-table-columns.tsx'
import { PlansTableToolbar } from '#/features/plans/components/plans-table-toolbar.tsx'
import { plansTableFeatures } from '#/features/plans/config/plans.config.ts'
import { PLAN_KEYS } from '#/features/plans/queries/plan.keys.ts'
import {
    EMPTY_PLAN_FILTERS,
    type PlanFilters,
    type PlanSearch,
} from '#/features/plans/schema/plans-search.schema.ts'
import { fetchPaginatedPlans } from '#/features/plans/service/plans.service.ts'
import type { PlanRecord } from '#/features/plans/types/plans.ts'

interface Props {
    search: PlanSearch
    navigate: NavigateFn
}

const EMPTY_DATA: PlanRecord[] = []

/** Converts Spatie-style sort strings into table sorting state. */
function sortToState(sort: string[]): SortingState {
    const value = Array.isArray(sort) ? sort.join(',') : ''
    return value ? (parseAsSpatieSort.parse(value) ?? []) : []
}

/** Converts table sorting state back into search params. */
function stateToSort(state: SortingState): string[] {
    const value = parseAsSpatieSort.serialize(state)
    return value ? [value] : []
}

/** Server-driven plans table with URL-synced state. */
export function PlansTable({ search, navigate }: Props) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({})

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: Math.max(0, (search.pageIndex ?? 1) - 1),
        pageSize: search.pageSize ?? 10,
    })

    const [sorting, setSorting] = useState<SortingState>(
        sortToState(search.sort ?? []),
    )

    const [filters, setFilters] = useState<PlanFilters>({
        ...EMPTY_PLAN_FILTERS,
        search: search.search ?? '',
        created_by_ids: search.created_by_ids ?? [],
        status: search.status ?? [],
    })

    const debouncedFilters = useDebounce(filters, 500)

    const queryKey = PLAN_KEYS.lists({
        sorting,
        filters: debouncedFilters,
        pagination,
    })

    const { data: tableData, isLoading } = useQuery({
        queryKey,
        queryFn: () =>
            fetchPaginatedPlans({
                sorting,
                filters: debouncedFilters,
                pagination,
            }),
    })

    const syncSearch = (patch: Partial<PlanSearch>) =>
        navigate({
            search: (prev) => ({ ...prev, ...patch }),
        })

    const onChangeFilters = (patch: Partial<PlanFilters>) => {
        const next = { ...filters, ...patch }
        setFilters(next)
        setPagination((current) => ({ ...current, pageIndex: 0 }))

        syncSearch({ ...next, pageIndex: 1 })
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
        syncSearch({ sort: stateToSort(next) })
    }

    const table = useTable({
        features: plansTableFeatures,
        columns,
        data: tableData?.data ?? EMPTY_DATA,
        state: { sorting, columnVisibility, rowSelection, pagination },
        onSortingChange: (updater) => {
            const next =
                typeof updater === 'function' ? updater(sorting) : updater
            onSortingChange(next)
        },
        onPaginationChange: (updater) => {
            const next =
                typeof updater === 'function' ? updater(pagination) : updater
            onPaginationChange(next)
        },
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        manualSorting: true,
        manualPagination: true,
        enableMultiSort: true,
        sortDescFirst: true,
        pageCount:
            tableData?.last_page ??
            Math.ceil((tableData?.total ?? 0) / (tableData?.per_page || 1)),
        rowCount: tableData?.total ?? 0,
    })

    return (
        <div className="space-y-4">
            <PlansTableToolbar
                table={table}
                filters={filters}
                onChangeFilters={onChangeFilters}
            />

            {isLoading ? (
                <DataTableSkeleton
                    columns={table.getAllColumns() as unknown as Array<Column<any, any>>}
                    rowCount={pagination.pageSize}
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="group/row"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={
                                                header.column.columnDef.meta
                                                    ?.className ?? ''
                                            }
                                        >
                                            {header.isPlaceholder ? null : (
                                                <table.FlexRender header={header} />
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
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                        className="group/row"
                                    >
                                        {row.getAllCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={
                                                    cell.column.columnDef.meta
                                                        ?.className ?? ''
                                                }
                                            >
                                                <table.FlexRender cell={cell} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No plans found.
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
                <DataTablePagination
                    table={table as unknown as TableInstance<any, any>}
                />
            )}
        </div>
    )
}
