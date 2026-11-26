// #/features/plans/components/plans-table-toolbar.tsx
import { X } from 'lucide-react'
import type { Table } from '@tanstack/react-table'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { plansTableFeatures } from '#/features/plans/config/plans.config.ts'
import {
    EMPTY_PLAN_FILTERS,
    type PlanFilters,
} from '#/features/plans/schema/plans-search.schema.ts'
import type { PlanRecord } from '#/features/plans/types/plans.ts'

interface Props {
    table: Table<typeof plansTableFeatures, PlanRecord>
    filters: PlanFilters
    onChangeFilters: (filters: Partial<PlanFilters>) => void
}

/** Checks whether any list filter is currently active. */
function hasActiveFilters(filters: PlanFilters): boolean {
    return Boolean(
        filters.search.trim() ||
            filters.created_by_ids.length ||
            filters.status.length,
    )
}

/** Search and reset controls for the plans table. */
export function PlansTableToolbar({ table, filters, onChangeFilters }: Props) {
    const hasSorting = table.store.state.sorting.length > 0
    const showReset = hasActiveFilters(filters) || hasSorting

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:flex-wrap">
                <Input
                    placeholder="Search plans..."
                    value={filters.search}
                    onChange={(event) =>
                        onChangeFilters({ search: event.target.value })
                    }
                    className="w-full sm:w-[220px] lg:w-[320px]"
                />

                {showReset && (
                    <div className="flex gap-2">
                        {hasActiveFilters(filters) && (
                            <Button
                                onClick={() => onChangeFilters(EMPTY_PLAN_FILTERS)}
                                variant="outline"
                                className="px-2 lg:px-3"
                            >
                                Reset Filters
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}

                        {hasSorting && (
                            <Button
                                variant="outline"
                                onClick={() => table.resetSorting()}
                                className="px-2 lg:px-3"
                            >
                                Reset Sort
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
