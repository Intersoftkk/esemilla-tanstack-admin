import { X } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { hasActiveFilters } from '@/lib/filters'
import {
    AppraisalCycleFilters,
    EMPTY_APPRAISAL_CYCLE_FILTERS,
} from '@/features/appraisal-cycle/schema/appraisal-cycle-search.schema'
import type { AppraisalCycleRecord } from '@/features/appraisal-cycle/types/appraisal-cycle'

interface Props<TData> {
    table: Table<TData>
    filters: AppraisalCycleFilters
    onChangeFilters: (filters: Partial<AppraisalCycleFilters>) => void
}

export function AppraisalCycleTableToolbar<
    TData extends AppraisalCycleRecord,
>({ table, filters, onChangeFilters }: Props<TData>) {

    const hasSorting = table.getState().sorting.length > 0

    const handleReset = () => onChangeFilters(EMPTY_APPRAISAL_CYCLE_FILTERS)

    const handleResetSort = () => {
        table.resetSorting()
    }

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:flex-wrap">
                <Input
                    placeholder="Search cycles..."
                    value={filters.search}
                    onChange={(e) => onChangeFilters({ search: e.target.value })}
                    className="w-full sm:w-[220px] lg:w-[320px]"
                />

                {(hasActiveFilters(filters) || hasSorting) && (
                    <div className="flex gap-2">
                        {hasActiveFilters(filters) && (
                            <Button onClick={handleReset} variant="outline" className="px-2 lg:px-3">
                                Reset Filters
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}

                        {hasSorting && (
                            <Button
                                variant="outline"
                                onClick={handleResetSort}
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
