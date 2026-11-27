// #/features/support/components/support-table.tsx
import { useState } from 'react'
import {
    useTable,
    type Column,
    type ColumnVisibilityState,
    type PaginationState,
    type SortingState,
    type Table as TableInstance,
} from '@tanstack/react-table'
import { AlertCircle, Plus, Ticket } from 'lucide-react'

import { DataTablePagination } from '#/components/datatable/data-table-pagination.tsx'
import DataTableSkeleton from '#/components/datatable/data-table-skeleton.tsx'
import { DataTablePaginationSkeleton } from '#/components/datatable/data-table-pagination-skeleton.tsx'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert.tsx'
import { Button } from '#/components/ui/button.tsx'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '#/components/ui/empty.tsx'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '#/components/ui/table.tsx'
import { SupportBulkActions } from '#/features/support/components/support-bulk-actions.tsx'
import { columns } from '#/features/support/components/support-table-columns.tsx'
import { SupportStats } from '#/features/support/components/support-stats.tsx'
import { SupportTableToolbar } from '#/features/support/components/support-table-toolbar.tsx'
import { supportTableFeatures } from '#/features/support/config/support.config.ts'
import { useSupport } from '#/features/support/context/support-context.tsx'
import { useSupportPaginateQuery } from '#/features/support/queries/support.queries.ts'
import {
    EMPTY_SUPPORT_FILTERS,
    type SupportFilters,
    type SupportSearch,
} from '#/features/support/schema/support-search.schema.ts'
import type { SupportRecord } from '#/features/support/types/support.type.ts'
import { downloadSupportCsv } from '#/features/support/utils/support.utils.ts'
import { useDebounce } from '#/hooks/use-debounce'
import type { NavigateFn } from '#/hooks/use-table-url-state'
import { parseAsSpatieSort } from '#/lib/nuqs-parsers'

interface Props {
    search: SupportSearch
    navigate: NavigateFn
}

const EMPTY_DATA: SupportRecord[] = []

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

/** Server-driven support table with URL-synced state and summary actions. */
export function SupportTable({ search, navigate }: Props) {
    const { setOpen } = useSupport()
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] =
        useState<ColumnVisibilityState>({})

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: Math.max(0, (search.pageIndex ?? 1) - 1),
        pageSize: search.pageSize ?? 10,
    })

    const [sorting, setSorting] = useState<SortingState>(
        sortToState(search.sort ?? []),
    )

    const [filters, setFilters] = useState<SupportFilters>({
        ...EMPTY_SUPPORT_FILTERS,
        search: search.search ?? '',
        company_ids: search.company_ids ?? [],
        status: search.status ?? [],
        priority: search.priority ?? [],
    })

    const debouncedFilters = useDebounce(filters, 500)

    const {
        data: tableData,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useSupportPaginateQuery({
        sorting,
        filters: debouncedFilters,
        pagination,
    })

    const support = tableData?.data ?? EMPTY_DATA

    const syncSearch = (patch: Partial<SupportSearch>) =>
        navigate({
            search: (prev) => ({ ...prev, ...patch }),
        })

    const onChangeFilters = (patch: Partial<SupportFilters>) => {
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
        features: supportTableFeatures,
        columns,
        data: support,
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
            <SupportStats
                support={support}
                total={tableData?.total ?? 0}
                isLoading={isLoading}
            />

            <SupportTableToolbar
                table={table}
                filters={filters}
                onChangeFilters={onChangeFilters}
                isFetching={isFetching}
                onRefresh={() => void refetch()}
                onExport={() => downloadSupportCsv(support)}
                canExport={support.length > 0}
            />

            {isError ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Could not load support tickets</AlertTitle>
                    <AlertDescription className="flex flex-wrap items-center gap-3">
                        <span>
                            {error instanceof Error
                                ? error.message
                                : 'Please try again in a moment.'}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void refetch()}
                        >
                            Try again
                        </Button>
                    </AlertDescription>
                </Alert>
            ) : isLoading ? (
                <DataTableSkeleton
                    columns={
                        table.getAllColumns() as unknown as Array<Column<any, any>>
                    }
                    rowCount={pagination.pageSize}
                />
            ) : support.length === 0 ? (
                <Empty className="rounded-2xl border border-dashed bg-linear-to-b from-muted/25 to-background py-14">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Ticket />
                        </EmptyMedia>
                        <EmptyTitle>No support tickets found</EmptyTitle>
                        <EmptyDescription>
                            {hasActiveFiltersValue(filters)
                                ? 'Try adjusting your search or filters.'
                                : 'Support tickets raised by your tenants will appear here.'}
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        {hasActiveFiltersValue(filters) ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onChangeFilters(EMPTY_SUPPORT_FILTERS)
                                }
                            >
                                Clear filters
                            </Button>
                        ) : (
                            <Button size="sm" onClick={() => setOpen('add')}>
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                New ticket
                            </Button>
                        )}
                    </EmptyContent>
                </Empty>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
                    <Table>
                        <TableHeader className="[&_th]:h-11 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase">
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
                                                <table.FlexRender
                                                    header={header}
                                                />
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
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
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {isLoading ? (
                <DataTablePaginationSkeleton />
            ) : !isError && support.length > 0 ? (
                <DataTablePagination
                    table={table as unknown as TableInstance<any, any>}
                />
            ) : null}

            <SupportBulkActions
                table={table as unknown as TableInstance<any, any>}
            />
        </div>
    )
}

/** Checks whether any filter is active, for the empty-state message. */
function hasActiveFiltersValue(filters: SupportFilters): boolean {
    return Boolean(
        filters.search.trim() ||
            filters.company_ids.length ||
            filters.status.length ||
            filters.priority.length,
    )
}
