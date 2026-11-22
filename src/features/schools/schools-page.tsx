import { Link } from "@tanstack/react-router";
import { AlertCircle, Building2, Plus, RefreshCw } from "lucide-react";
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
import type { SchoolSort } from "#/features/schools/config/school.config.ts";
import {
	useDeleteSchoolMutation,
	useSchoolsQuery,
	useUpdateSchoolStatusMutation,
} from "#/features/schools/queries/school.queries.ts";
import type {
	School,
	SchoolStatus,
} from "#/features/schools/types/school.types.ts";
import {
	downloadCsv,
	schoolsToCsv,
} from "#/features/schools/utils/school.utils.ts";

export function SchoolsPage() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<"all" | SchoolStatus>("all");
	const [sort, setSort] = useState<SchoolSort>("newest");
	const [view, setView] = useState<"grid" | "table">("grid");
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

	return (
		<div className="space-y-6">
			<PageHeader
				title="Schools"
				description="Manage onboarded institutions, portal domains, plans, and lifecycle status."
				icon={Building2}
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => void schoolsQuery.refetch()}
							disabled={schoolsQuery.isFetching}
						>
							<RefreshCw
								className={`mr-1.5 h-3.5 w-3.5 ${schoolsQuery.isFetching ? "animate-spin" : ""}`}
							/>
							Refresh
						</Button>
						<Button asChild size="sm">
							<Link to="/schools/new">
								<Plus className="mr-1.5 h-3.5 w-3.5" />
								Onboard school
							</Link>
						</Button>
					</div>
				}
			/>

			{schoolsQuery.isError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Unable to load schools</AlertTitle>
					<AlertDescription>
						{schoolsQuery.error instanceof Error
							? schoolsQuery.error.message
							: "Could not retrieve school workspaces."}
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
			) : filtered.length === 0 ? (
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
					{filtered.map((school) => (
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
				<SchoolsTable schools={filtered} onDelete={setDeleteTarget} />
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
