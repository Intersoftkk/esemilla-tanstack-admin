// #/features/role-permissions/components/role-permissions-table.tsx
import { useState } from 'react'
import {
    useTable,
    type Column,
    type ColumnVisibilityState,
    type PaginationState,
    type SortingState,
    type Table as TableInstance,
} from '@tanstack/react-table'
import { AlertCircle, CalendarRange, Plus } from 'lucide-react'

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
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard.tsx'
import { RolePermissionsBulkActions } from '#/features/role-permissions/components/role-permissions-bulk-actions.tsx'
import { columns } from '#/features/role-permissions/components/role-permissions-table-columns.tsx'
import { RolePermissionsStats } from '#/features/role-permissions/components/role-permissions-stats.tsx'
import { RolePermissionsTableToolbar } from '#/features/role-permissions/components/role-permissions-table-toolbar.tsx'
import { rolePermissionsTableFeatures } from '#/features/role-permissions/config/role-permissions.config.ts'
import { useRolePermissions } from '#/features/role-permissions/context/role-permissions-context.tsx'
import { useRolePermissionsPaginateQuery } from '#/features/role-permissions/queries/role-permission.queries.ts'
import {
    EMPTY_ROLE_PERMISSION_FILTERS,
    type RolePermissionFilters,
    type RolePermissionSearch,
} from '#/features/role-permissions/schema/role-permissions-search.schema.ts'
import type { RolePermissionRecord } from '#/features/role-permissions/types/role-permissions.ts'
import { downloadRolePermissionsCsv } from '#/features/role-permissions/utils/role-permissions.utils.ts'
import { useDebounce } from '#/hooks/use-debounce'
import type { NavigateFn } from '#/hooks/use-table-url-state'
import { parseAsSpatieSort } from '#/lib/nuqs-parsers'

interface Props {
    search: RolePermissionSearch
    navigate: NavigateFn
}

const EMPTY_DATA: RolePermissionRecord[] = []

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

/** Server-driven rolePermissions table with URL-synced state and summary actions. */
export function RolePermissionsTable({ search, navigate }: Props) {
    const { setOpen } = useRolePermissions()
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

    const [filters, setFilters] = useState<RolePermissionFilters>({
        ...EMPTY_ROLE_PERMISSION_FILTERS,
        search: search.search ?? '',
        created_by_ids: search.created_by_ids ?? [],
        status: search.status ?? [],
    })

    const debouncedFilters = useDebounce(filters, 500)

    const {
        data: tableData,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useRolePermissionsPaginateQuery({
        sorting,
        filters: debouncedFilters,
        pagination,
    })

    const rolePermissions = tableData?.data ?? EMPTY_DATA

    const syncSearch = (patch: Partial<RolePermissionSearch>) =>
        navigate({
            search: (prev) => ({ ...prev, ...patch }),
        })

    const onChangeFilters = (patch: Partial<RolePermissionFilters>) => {
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
        features: rolePermissionsTableFeatures,
        columns,
        data: rolePermissions,
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
            <RolePermissionsStats
                rolePermissions={rolePermissions}
                total={tableData?.total ?? 0}
                isLoading={isLoading}
            />

            <RolePermissionsTableToolbar
                table={table}
                filters={filters}
                onChangeFilters={onChangeFilters}
                isFetching={isFetching}
                onRefresh={() => void refetch()}
                onExport={() => downloadRolePermissionsCsv(rolePermissions)}
                canExport={rolePermissions.length > 0}
            />

            {isError ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Could not load rolePermissions</AlertTitle>
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
            ) : rolePermissions.length === 0 ? (
                <Empty className="rounded-2xl border border-dashed bg-linear-to-b from-muted/25 to-background py-14">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <CalendarRange />
                        </EmptyMedia>
                        <EmptyTitle>No role permissions found</EmptyTitle>
                        <EmptyDescription>
                            {hasActiveFiltersValue(filters)
                                ? 'Try adjusting your search or filters.'
                                : 'Role permission assignments will appear here once created.'}
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        {hasActiveFiltersValue(filters) ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onChangeFilters(EMPTY_ROLE_PERMISSION_FILTERS)
                                }
                            >
                                Clear filters
                            </Button>
                        ) : (
                            <PermissionGuard
                                permissions={[PLATFORM_PERMISSIONS.PlatformRolePermissionAssign]}
                            >
                                <Button size="sm" onClick={() => setOpen('add')}>
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    Create rolePermission
                                </Button>
                            </PermissionGuard>
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
            ) : !isError && rolePermissions.length > 0 ? (
                <DataTablePagination
                    table={table as unknown as TableInstance<any, any>}
                />
            ) : null}

            <RolePermissionsBulkActions
                table={table as unknown as TableInstance<any, any>}
            />
        </div>
    )
}

/** Checks whether any filter is active, for the empty-state message. */
function hasActiveFiltersValue(filters: RolePermissionFilters): boolean {
    return Boolean(
        filters.search.trim() ||
            filters.created_by_ids.length ||
            filters.status.length,
    )
}
