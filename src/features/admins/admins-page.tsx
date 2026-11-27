// #/features/admins/admins-page.tsx
import { useQuery } from "@tanstack/react-query";
import { UserCog } from "lucide-react";
import { useDeferredValue, useState } from "react";

import {
	type AdminListColumn,
	AdminListTable,
} from "#/components/datatable/admin-list-table.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { getAdminsFn } from "#/features/admins/server/admins.functions.ts";
import type { AdminRecord } from "#/features/admins/types/admins.type.ts";
import { formatDate, formatRelative } from "#/lib/format.ts";

/** Central admin accounts, from `/admin/admins`. */
export function AdminsPage() {
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const search = useDeferredValue(searchInput);

	const { data, isLoading, error } = useQuery({
		queryKey: ["admins", { page, search }],
		queryFn: () =>
			getAdminsFn({
				data: { page, perPage: 20, search: search.trim() || undefined },
			}),
		placeholderData: (previous) => previous,
	});

	const columns: Array<AdminListColumn<AdminRecord>> = [
		{
			id: "name",
			header: "Admin",
			cell: (row) => (
				<div className="min-w-0">
					<p className="truncate text-sm font-medium text-foreground">
						{row.name ?? "Unnamed admin"}
					</p>
					<p className="truncate text-[11px] text-muted-foreground">
						{row.email ?? "—"}
					</p>
				</div>
			),
		},
		{
			id: "roles",
			header: "Roles",
			cell: (row) => (
				<div className="flex flex-wrap gap-1">
					{row.roles.length === 0 && (
						<span className="text-xs text-muted-foreground">—</span>
					)}
					{row.roles.map((role) => (
						<Badge key={role} variant="secondary" className="capitalize">
							{role}
						</Badge>
					))}
				</div>
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
			id: "lastLogin",
			header: "Last sign-in",
			cell: (row) => (
				<span className="whitespace-nowrap text-xs text-muted-foreground">
					{row.lastLoginAt ? formatRelative(row.lastLoginAt) : "Never"}
				</span>
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
				title="Admins"
				description="Platform team members with console access."
				icon={UserCog}
			/>

			<AdminListTable
				columns={columns}
				rows={data?.items ?? []}
				getRowId={(row) => row.id}
				isLoading={isLoading}
				errorMessage={error instanceof Error ? error.message : null}
				emptyMessage="No admin accounts found."
				search={{
					value: searchInput,
					onValueChange: (value) => {
						setSearchInput(value);
						setPage(1);
					},
					placeholder: "Search admins…",
				}}
				meta={data?.meta}
				onPageChange={setPage}
			/>
		</div>
	);
}
