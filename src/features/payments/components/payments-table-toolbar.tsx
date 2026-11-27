// #/features/payments/components/payments-table-toolbar.tsx
import { Download, ListFilter, RefreshCw, X } from 'lucide-react'
import type { Table } from '@tanstack/react-table'

import { DataTableFacetedFilter } from '#/components/datatable/data-table-faceted-filter.tsx'
import { DataTableViewOptions } from '#/components/datatable/data-table-view-options.tsx'
import { Button } from '#/components/ui/button.tsx'
import { SearchField } from '#/components/fields/search-field.tsx'
import type { paymentsTableFeatures } from '#/features/payments/config/payments.config.ts'
import { paymentStatusOptions } from '#/features/payments/data/payment.constant'
import {
    EMPTY_PAYMENT_FILTERS,
    type PaymentFilters,
} from '#/features/payments/schema/payments-search.schema.ts'
import type { PaymentRecord } from '#/features/payments/types/payments.type.ts'

interface Props {
    table: Table<typeof paymentsTableFeatures, PaymentRecord>
    filters: PaymentFilters
    onChangeFilters: (filters: Partial<PaymentFilters>) => void
    isFetching?: boolean
    onRefresh?: () => void
    onExport?: () => void
    canExport?: boolean
}

/** Checks whether any list filter is currently active. */
function hasActiveFilters(filters: PaymentFilters): boolean {
    return Boolean(
        filters.search.trim() ||
            filters.created_by_ids.length ||
            filters.status.length,
    )
}

/** Search, status filter and utility controls for the payments table. */
export function PaymentsTableToolbar({
    table,
    filters,
    onChangeFilters,
    isFetching = false,
    onRefresh,
    onExport,
    canExport = false,
}: Props) {
    const hasSorting = table.store.state.sorting.length > 0
    const showReset = hasActiveFilters(filters) || hasSorting

    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <SearchField
                    value={filters.search}
                    onChange={(search) => onChangeFilters({ search })}
                    placeholder="Search payments..."
                    className="w-full sm:w-56 lg:w-72"
                />

                <DataTableFacetedFilter
                    title="Status"
                    icon={ListFilter}
                    options={paymentStatusOptions}
                    selectedValues={filters.status}
                    onChange={(status) => onChangeFilters({ status })}
                />

                {showReset && (
                    <>
                        {hasActiveFilters(filters) && (
                            <Button
                                onClick={() =>
                                    onChangeFilters(EMPTY_PAYMENT_FILTERS)
                                }
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                            >
                                Reset filters
                                <X className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                        )}

                        {hasSorting && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => table.resetSorting()}
                            >
                                Reset sort
                            </Button>
                        )}
                    </>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <DataTableViewOptions
                    table={table as unknown as Table<any, any>}
                />

                {onRefresh && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={onRefresh}
                        disabled={isFetching}
                    >
                        <RefreshCw
                            className={`mr-1.5 h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </Button>
                )}

                {onExport && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={onExport}
                        disabled={!canExport}
                    >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Export
                    </Button>
                )}
            </div>
        </div>
    )
}
