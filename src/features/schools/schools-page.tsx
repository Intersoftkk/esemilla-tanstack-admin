import { Link } from "@tanstack/react-router";
import { AlertCircle, Building2, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ConfirmDialog } from "#/components/confirm-dialog.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent } from "#/components/ui/card.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { SchoolCard } from "#/features/schools/components/school-card.tsx";
import { SchoolsStats } from "#/features/schools/components/schools-stats.tsx";
import { SchoolsTable } from "#/features/schools/components/schools-table.tsx";
import { SchoolsToolbar } from "#/features/schools/components/schools-toolbar.tsx";
import type { SchoolsSearch } from "#/features/schools/schema/schools-search.schema.ts";
import {
	useDeleteSchoolMutation,
	useSchoolsQuery,
	useUpdateSchoolStatusMutation,
} from "#/features/schools/queries/school.queries.ts";
import type { School } from "#/features/schools/types/school.types.ts";
import {
	downloadCsv,
	schoolsToCsv,
} from "#/features/schools/utils/school.utils.ts";

export function SchoolsPage({
	searchState,
	onSearchChange,
}: {
	searchState: SchoolsSearch;
	onSearchChange: (patch: Partial<SchoolsSearch>) => void;
}) {
	const { search, status, sort, view, page, pageSize } = searchState;
	const setSearch = (search: string) => onSearchChange({ search, page: 1 });
	const setStatus = (status: SchoolsSearch["status"]) =>
		onSearchChange({ status, page: 1 });
	const setSort = (sort: SchoolsSearch["sort"]) =>
		onSearchChange({ sort, page: 1 });
	const setView = (view: SchoolsSearch["view"]) =>
		onSearchChange({ view, page: 1 });
	const [deleteTarget, setDeleteTarget] = useState<School | null>(null);

	const schoolsQuery = useSchoolsQuery();
	const statusMutation = useUpdateSchoolStatusMutation();
	const deleteMutation = useDeleteSchoolMutation();

	const schools = schoolsQuery.data ?? [];

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		const matching = schools.filter((school) => {
			if (status !== "all" && school.status !== status) return false;
			if (!q) return true;
			return (
				school.name.toLowerCase().includes(q) ||
				school.slug.toLowerCase().includes(q) ||
				school.address.city.toLowerCase().includes(q) ||
				school.email.toLowerCase().includes(q)
			);
		});

		const copy = [...matching];
		if (sort === "name") {
			copy.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sort === "students") {
			copy.sort((a, b) => b.usage.students - a.usage.students);
		} else {
			copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
		}
		return copy;
	}, [schools, search, status, sort]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const currentPage = Math.min(page, pageCount);
	const visibleSchools = filtered.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Schools"
				description="Manage onboarded institutions, portal domains, plans, and lifecycle status."
				icon={Building2}
				iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
				actions={
					<Button asChild size="sm">
						<Link to="/schools/new">
							<Plus className="mr-1.5 h-3.5 w-3.5" />
							Onboard school
						</Link>
					</Button>
				}
			/>

			{schoolsQuery.isError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Unable to load schools</AlertTitle>
					<AlertDescription className="flex flex-wrap items-center gap-3">
						{schoolsQuery.error instanceof Error
							? schoolsQuery.error.message
							: "Could not retrieve school workspaces."}
						<Button
							variant="outline"
							size="sm"
							onClick={() => void schoolsQuery.refetch()}
						>
							Try again
						</Button>
					</AlertDescription>
				</Alert>
			)}

			<SchoolsStats schools={schools} isLoading={schoolsQuery.isLoading} />

			<SchoolsToolbar
				search={search}
				onSearchChange={setSearch}
				status={status}
				onStatusChange={setStatus}
				sort={sort}
				onSortChange={setSort}
				view={view}
				onViewChange={setView}
				onRefresh={() => void schoolsQuery.refetch()}
				isFetching={schoolsQuery.isFetching}
				onReset={() =>
					onSearchChange({ search: "", status: "all", sort: "newest", page: 1 })
				}
				canExport={filtered.length > 0}
				onExportCsv={() => {
					const date = new Date().toISOString().slice(0, 10);
					downloadCsv(`schools-${date}.csv`, schoolsToCsv(filtered));
				}}
			/>

			{schoolsQuery.isLoading ? (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((slot) => (
						<Card key={`school-card-${slot}`}>
							<CardContent className="space-y-3 p-4">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-20 w-full" />
								<Skeleton className="h-8 w-full" />
							</CardContent>
						</Card>
					))}
				</div>
			) : schoolsQuery.isError ? null : filtered.length === 0 ? (
				<Card className="border-dashed shadow-xs">
					<CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
						<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
							<Building2 className="h-6 w-6 text-muted-foreground" />
						</div>
						<p className="text-sm font-medium text-foreground">
							{schools.length === 0
								? "No schools onboarded yet"
								: "No schools match your filters"}
						</p>
						<p className="mt-1 max-w-sm text-xs text-muted-foreground">
							{schools.length === 0
								? "Use the onboarding wizard to provision your first school portal."
								: "Clear the search query or switch status filter."}
						</p>
						{schools.length > 0 && (
							<Button
								variant="outline"
								size="sm"
								className="mt-4"
								onClick={() =>
									onSearchChange({
										search: "",
										status: "all",
										sort: "newest",
										page: 1,
									})
								}
							>
								Clear filters
							</Button>
						)}
						{schools.length === 0 && (
							<Button asChild size="sm" className="mt-4">
								<Link to="/schools/new">
									<Plus className="mr-1.5 h-3.5 w-3.5" />
									Onboard first school
								</Link>
							</Button>
						)}
					</CardContent>
				</Card>
			) : view === "grid" ? (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{visibleSchools.map((school) => (
						<SchoolCard
							key={school.id}
							school={school}
							onUpdateStatus={(target, nextStatus) =>
								statusMutation.mutate({ id: target.id, status: nextStatus })
							}
							onDelete={setDeleteTarget}
						/>
					))}
				</div>
			) : (
				<SchoolsTable schools={visibleSchools} onDelete={setDeleteTarget} />
			)}

			{!schoolsQuery.isLoading &&
				!schoolsQuery.isError &&
				filtered.length > 0 && (
					<div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
						<span>
							{filtered.length} schools · Page {currentPage} of {pageCount}
						</span>
						<div className="flex items-center gap-2">
							<label htmlFor="schools-page-size">Rows per page</label>
							<select
								id="schools-page-size"
								className="h-8 rounded-md border bg-background px-2 text-foreground"
								value={pageSize}
								onChange={(event) =>
									onSearchChange({
										pageSize: Number(event.target.value),
										page: 1,
									})
								}
							>
								{[10, 20, 50, 100].map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</select>
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage <= 1}
								onClick={() => onSearchChange({ page: currentPage - 1 })}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage >= pageCount}
								onClick={() => onSearchChange({ page: currentPage + 1 })}
							>
								Next
							</Button>
						</div>
					</div>
				)}

			<ConfirmDialog
				open={Boolean(deleteTarget)}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
				title="Delete school workspace?"
				desc={`"${deleteTarget?.name ?? ""}" and its portal configuration will be removed permanently.`}
				confirmText="Delete workspace"
				destructive
				isLoading={deleteMutation.isPending}
				handleConfirm={() => {
					if (!deleteTarget) return;
					deleteMutation.mutate(deleteTarget.id, {
						onSuccess: () => setDeleteTarget(null),
					});
				}}
			/>
		</div>
	);
}
