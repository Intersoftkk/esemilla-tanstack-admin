// #/features/owners/owners-page.tsx
import { useQuery } from "@tanstack/react-query";
import { Crown } from "lucide-react";
import { useDeferredValue, useState } from "react";

import {
	type AdminListColumn,
	AdminListTable,
} from "#/components/datatable/admin-list-table.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { getOwnersFn } from "#/features/owners/server/owners.functions.ts";
import type { OwnerRecord } from "#/features/owners/types/owners.type.ts";
import { formatDate, formatNumber } from "#/lib/format.ts";

/** Central owner accounts, from `/v1/admin/owners`. */
export function OwnersPage() {
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const search = useDeferredValue(searchInput);

	const { data, isLoading, error } = useQuery({
		queryKey: ["owners", { page, search }],
		queryFn: () =>
			getOwnersFn({
				data: { page, perPage: 20, search: search.trim() || undefined },
			}),
		placeholderData: (previous) => previous,
	});

	const columns: Array<AdminListColumn<OwnerRecord>> = [
		{
			id: "name",
			header: "Owner",
			cell: (row) => (
				<div className="min-w-0">
					<p className="truncate text-sm font-medium text-foreground">
						{row.name ?? "Unnamed owner"}
					</p>
					<p className="truncate text-[11px] text-muted-foreground">
						{row.email ?? row.phone ?? "—"}
					</p>
				</div>
			),
		},
		{
			id: "tenants",
			header: "Tenants",
			cell: (row) => (
				<span className="text-sm tabular-nums text-foreground">
					{formatNumber(row.tenantsCount)}
				</span>
			),
		},
		{
			id: "status",
			header: "Status",
			cell: (row) => (
				<Badge
					variant={
						row.status.toLowerCase() === "active" ? "default" : "outline"
					}
					className="capitalize"
				>
					{row.status}
				</Badge>
			),
		},
		{
			id: "createdAt",
			header: "Created",
			cell: (row) => (
				<span className="whitespace-nowrap text-xs text-muted-foreground">
					{formatDate(row.createdAt)}
				</span>
			),
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Owners"
				description="Central owner profiles and the tenants they hold."
				icon={Crown}
			/>

			<AdminListTable
				columns={columns}
				rows={data?.items ?? []}
				getRowId={(row) => row.id}
				isLoading={isLoading}
				errorMessage={error instanceof Error ? error.message : null}
				emptyMessage="No owner profiles found."
				search={{
					value: searchInput,
					onValueChange: (value) => {
						setSearchInput(value);
						setPage(1);
					},
					placeholder: "Search owners…",
				}}
				meta={data?.meta}
				onPageChange={setPage}
			/>
		</div>
	);
}
