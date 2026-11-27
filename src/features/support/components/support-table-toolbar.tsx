// #/features/support/components/support-table-toolbar.tsx

import type { Table } from "@tanstack/react-table";
import { Download, ListFilter, RefreshCw, X } from "lucide-react";

import { DataTableFacetedFilter } from "#/components/datatable/data-table-faceted-filter.tsx";
import { DataTableViewOptions } from "#/components/datatable/data-table-view-options.tsx";
import { SearchField } from "#/components/fields/search-field.tsx";
import { Button } from "#/components/ui/button.tsx";
import type { supportTableFeatures } from "#/features/support/config/support.config.ts";
import {
	supportPriorityOptions,
	supportStatusOptions,
} from "#/features/support/data/support.constant";
import {
	EMPTY_SUPPORT_FILTERS,
	type SupportFilters,
} from "#/features/support/schema/support-search.schema.ts";
import type { SupportRecord } from "#/features/support/types/support.type.ts";

interface Props {
	table: Table<typeof supportTableFeatures, SupportRecord>;
	filters: SupportFilters;
	onChangeFilters: (filters: Partial<SupportFilters>) => void;
	isFetching?: boolean;
	onRefresh?: () => void;
	onExport?: () => void;
	canExport?: boolean;
}

/** Checks whether any list filter is currently active. */
function hasActiveFilters(filters: SupportFilters): boolean {
	return Boolean(
		filters.search.trim() ||
			filters.company_ids.length ||
			filters.status.length ||
			filters.priority.length,
	);
}

/** Search, status/priority filters and utility controls for the support table. */
export function SupportTableToolbar({
	table,
	filters,
	onChangeFilters,
	isFetching = false,
	onRefresh,
	onExport,
	canExport = false,
}: Props) {
	const hasSorting = table.store.state.sorting.length > 0;
	const showReset = hasActiveFilters(filters) || hasSorting;

	return (
		<div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-3 shadow-xs lg:flex-row lg:items-center lg:justify-between">
			<div className="flex flex-1 flex-wrap items-center gap-2">
				<SearchField
					value={filters.search}
					onChange={(search) => onChangeFilters({ search })}
					placeholder="Search tickets..."
					className="w-full sm:w-56 lg:w-72"
				/>

				<DataTableFacetedFilter
					title="Status"
					icon={ListFilter}
					options={supportStatusOptions}
					selectedValues={filters.status}
					onChange={(status) => onChangeFilters({ status })}
				/>

				<DataTableFacetedFilter
					title="Priority"
					icon={ListFilter}
					options={supportPriorityOptions}
					selectedValues={filters.priority}
					onChange={(priority) => onChangeFilters({ priority })}
				/>

				{showReset && (
					<>
						{hasActiveFilters(filters) && (
							<Button
								onClick={() => onChangeFilters(EMPTY_SUPPORT_FILTERS)}
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
				<DataTableViewOptions table={table as unknown as Table<any, any>} />

				{onRefresh && (
					<Button
						variant="outline"
						size="sm"
						className="h-8"
						onClick={onRefresh}
						disabled={isFetching}
					>
						<RefreshCw
							className={`mr-1.5 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
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
	);
}
