import { Download, LayoutGrid, List, Search, RefreshCw, X } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import {
	SCHOOL_SORT_OPTIONS,
	type SchoolSort,
} from "#/features/schools/config/school.config.ts";
import type { SchoolStatus } from "#/features/schools/types/school.types.ts";

interface SchoolsToolbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	status: "all" | SchoolStatus;
	onStatusChange: (value: "all" | SchoolStatus) => void;
	sort: SchoolSort;
	onSortChange: (value: SchoolSort) => void;
	view: "grid" | "table";
	onViewChange: (view: "grid" | "table") => void;
	canExport: boolean;
	onExportCsv: () => void;
	onRefresh: () => void;
	isFetching: boolean;
	onReset: () => void;
}

export function SchoolsToolbar({
	search,
	onSearchChange,
	status,
	onStatusChange,
	sort,
	onSortChange,
	view,
	onViewChange,
	canExport,
	onExportCsv,
	onRefresh,
	isFetching,
	onReset,
}: SchoolsToolbarProps) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-1 flex-wrap items-center gap-2">
				<div className="relative w-full sm:w-64">
					<Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder="Search name, slug, city..."
						className="h-8 pl-8 text-xs"
					/>
				</div>

				<Select
					value={status}
					onValueChange={(value) =>
						onStatusChange(value as "all" | SchoolStatus)
					}
				>
					<SelectTrigger className="h-8 w-36 text-xs">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All statuses</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="pending">Pending review</SelectItem>
						<SelectItem value="suspended">Suspended</SelectItem>
						<SelectItem value="archived">Archived</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={sort}
					onValueChange={(value) => onSortChange(value as SchoolSort)}
				>
					<SelectTrigger className="h-8 w-40 text-xs">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						{SCHOOL_SORT_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{(search || status !== "all" || sort !== "newest") && (
					<Button variant="ghost" size="sm" className="h-8" onClick={onReset}>
						Reset filters <X className="ml-1.5 h-3.5 w-3.5" />
					</Button>
				)}
			</div>

			<div className="flex items-center gap-2">
				<div className="inline-flex rounded-md border bg-muted/30 p-0.5">
					<Button
						type="button"
						variant={view === "grid" ? "secondary" : "ghost"}
						size="icon-sm"
						onClick={() => onViewChange("grid")}
						title="Grid view"
					>
						<LayoutGrid className="h-3.5 w-3.5" />
					</Button>
					<Button
						type="button"
						variant={view === "table" ? "secondary" : "ghost"}
						size="icon-sm"
						onClick={() => onViewChange("table")}
						title="Table view"
					>
						<List className="h-3.5 w-3.5" />
					</Button>
				</div>

				<Button
					variant="outline"
					size="sm"
					className="h-8"
					onClick={onRefresh}
					disabled={isFetching}
				>
					<RefreshCw
						className={`mr-1.5 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
					/>{" "}
					Refresh
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={!canExport}
					onClick={onExportCsv}
				>
					<Download className="mr-1.5 h-3.5 w-3.5" />
					Export CSV
				</Button>
			</div>
		</div>
	);
}
