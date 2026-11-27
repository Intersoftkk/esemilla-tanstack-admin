// #/features/domains/domains-page.tsx
import { useQuery } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { useDeferredValue, useState } from "react";

import {
	type AdminListColumn,
	AdminListTable,
} from "#/components/datatable/admin-list-table.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { getDomainsFn } from "#/features/domains/server/domains.functions.ts";
import type { DomainRecord } from "#/features/domains/types/domains.type.ts";
import { formatDate } from "#/lib/format.ts";

/** Custom domains attached to tenants, from `/v1/admin/domains`. */
export function DomainsPage() {
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const search = useDeferredValue(searchInput);

	const { data, isLoading, error } = useQuery({
		queryKey: ["domains", { page, search }],
		queryFn: () =>
			getDomainsFn({
				data: { page, perPage: 20, search: search.trim() || undefined },
			}),
		placeholderData: (previous) => previous,
	});

	const columns: Array<AdminListColumn<DomainRecord>> = [
		{
			id: "domain",
			header: "Domain",
			cell: (row) => (
				<span className="font-mono text-xs text-foreground">{row.domain}</span>
			),
		},
		{
			id: "tenant",
			header: "Tenant",
			cell: (row) => (
				<span className="text-sm text-muted-foreground">
					{row.tenant?.name ?? "—"}
				</span>
			),
		},
		{
			id: "status",
			header: "Status",
			cell: (row) => (
				<Badge
					variant={row.verified ? "default" : "outline"}
					className="capitalize"
				>
					{row.verified ? "verified" : row.status}
				</Badge>
			),
		},
		{
			id: "primary",
			header: "Primary",
			cell: (row) =>
				row.isPrimary ? <Badge variant="secondary">Primary</Badge> : null,
		},
		{
			id: "createdAt",
			header: "Added",
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
				title="Domains"
				description="Custom hostnames pointed at tenant workspaces."
				icon={Globe}
			/>

			<AdminListTable
				columns={columns}
				rows={data?.items ?? []}
				getRowId={(row) => row.id}
				isLoading={isLoading}
				errorMessage={error instanceof Error ? error.message : null}
				emptyMessage="No custom domains yet."
				search={{
					value: searchInput,
					onValueChange: (value) => {
						setSearchInput(value);
						setPage(1);
					},
					placeholder: "Search domains…",
				}}
				meta={data?.meta}
				onPageChange={setPage}
			/>
		</div>
	);
}
