// #/components/datatable/admin-list-table.tsx
import { AlertCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table.tsx";
import { cn } from "#/lib/utils";

/** Stable keys for the loading skeleton rows. */
const SKELETON_ROW_KEYS = ["one", "two", "three", "four", "five"] as const;

export interface AdminListColumn<T> {
	id: string;
	header: string;
	className?: string;
	cell: (row: T) => ReactNode;
}

interface AdminListTableProps<T> {
	columns: Array<AdminListColumn<T>>;
	rows: Array<T>;
	getRowId: (row: T) => string;
	isLoading?: boolean;
	errorMessage?: string | null;
	emptyMessage: string;
	search?: {
		value: string;
		onValueChange: (value: string) => void;
		placeholder?: string;
	};
	meta?: {
		page: number;
		lastPage: number;
		total: number;
		perPage: number;
	};
	onPageChange?: (page: number) => void;
	onRowClick?: (row: T) => void;
	className?: string;
}

/**
 * Compact list surface for the platform admin modules that only need a table,
 * a search box and page controls (audit log, feature usage, domains, ...).
 */
export function AdminListTable<T>({
	columns,
	rows,
	getRowId,
	isLoading,
	errorMessage,
	emptyMessage,
	search,
	meta,
	onPageChange,
	onRowClick,
	className,
}: AdminListTableProps<T>) {
	const colSpan = columns.length;

	return (
		<div className={cn("space-y-3", className)}>
			{search && (
				<div className="relative max-w-sm">
					<Search
						className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
						aria-hidden="true"
					/>
					<Input
						type="search"
						value={search.value}
						onChange={(event) => search.onValueChange(event.target.value)}
						placeholder={search.placeholder ?? "Search…"}
						aria-label={search.placeholder ?? "Search"}
						className="ps-8"
					/>
				</div>
			)}

			<div className="overflow-hidden rounded-xl border border-border/70 bg-card">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/40 hover:bg-muted/40">
							{columns.map((column) => (
								<TableHead
									key={column.id}
									className={cn(
										"text-[11px] font-semibold uppercase",
										column.className,
									)}
								>
									{column.header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading &&
							SKELETON_ROW_KEYS.map((key) => (
								<TableRow key={`skeleton-${key}`}>
									{columns.map((column) => (
										<TableCell key={column.id}>
											<Skeleton className="h-4 w-full max-w-40" />
										</TableCell>
									))}
								</TableRow>
							))}

						{!isLoading && errorMessage && (
							<TableRow>
								<TableCell colSpan={colSpan} className="py-10">
									<div className="flex flex-col items-center gap-1.5 text-center">
										<AlertCircle
											className="size-5 text-destructive"
											aria-hidden="true"
										/>
										<p className="text-sm font-medium text-foreground">
											Could not load this list
										</p>
										<p className="max-w-md text-xs text-muted-foreground">
											{errorMessage}
										</p>
									</div>
								</TableCell>
							</TableRow>
						)}

						{!isLoading && !errorMessage && rows.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={colSpan}
									className="py-10 text-center text-sm text-muted-foreground"
								>
									{emptyMessage}
								</TableCell>
							</TableRow>
						)}

						{!isLoading &&
							!errorMessage &&
							rows.map((row) => (
								<TableRow
									key={getRowId(row)}
									onClick={onRowClick ? () => onRowClick(row) : undefined}
									className={cn(onRowClick && "cursor-pointer")}
								>
									{columns.map((column) => (
										<TableCell key={column.id} className={column.className}>
											{column.cell(row)}
										</TableCell>
									))}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>

			{meta && meta.total > 0 && (
				<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
					<span className="tabular-nums">
						Page {meta.page} of {Math.max(meta.lastPage, 1)} · {meta.total}{" "}
						total
					</span>
					{onPageChange && (
						<div className="flex items-center gap-1.5">
							<Button
								variant="outline"
								size="sm"
								onClick={() => onPageChange(meta.page - 1)}
								disabled={meta.page <= 1}
							>
								<ChevronLeft className="size-3.5" aria-hidden="true" />
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onPageChange(meta.page + 1)}
								disabled={meta.page >= meta.lastPage}
							>
								Next
								<ChevronRight className="size-3.5" aria-hidden="true" />
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
