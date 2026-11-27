// #/features/feature-usage/feature-usage-page.tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Gauge, RotateCcw } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { toast } from "sonner";

import {
	type AdminListColumn,
	AdminListTable,
} from "#/components/datatable/admin-list-table.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import { PLATFORM_PERMISSIONS } from "#/config/permissions.config.ts";
import { usePermission } from "#/features/auth/hooks/use-permission.ts";
import {
	getFeatureUsagesFn,
	resetFeatureUsageFn,
} from "#/features/feature-usage/server/feature-usage.functions.ts";
import type { FeatureUsageRecord } from "#/features/feature-usage/types/feature-usage.type.ts";
import { formatDateTime, formatNumber } from "#/lib/format.ts";

function usagePercent(row: FeatureUsageRecord): number {
	if (row.limit === null || row.limit <= 0) return 0;
	return Math.min(100, Math.round((row.used / row.limit) * 100));
}

/** Consumption of each plan feature per tenant, from `/admin/feature-usage`. */
export function FeatureUsagePage() {
	const { hasPermission } = usePermission();
	const canEdit = hasPermission(PLATFORM_PERMISSIONS.PlatformFeatureUsageEdit);
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const search = useDeferredValue(searchInput);

	const { data, isLoading, error } = useQuery({
		queryKey: ["feature-usage", { page, search }],
		queryFn: () =>
			getFeatureUsagesFn({
				data: { page, perPage: 20, search: search.trim() || undefined },
			}),
		placeholderData: (previous) => previous,
	});

	const resetMutation = useMutation({
		mutationFn: (id: string) => resetFeatureUsageFn({ data: id }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["feature-usage"] });
			toast.success("Usage counter reset");
		},
		onError: (mutationError: unknown) => {
			toast.error(
				mutationError instanceof Error
					? mutationError.message
					: "Could not reset the counter",
			);
		},
	});

	const columns: Array<AdminListColumn<FeatureUsageRecord>> = [
		{
			id: "tenant",
			header: "Tenant",
			cell: (row) => (
				<span className="text-sm text-foreground">
					{row.tenant?.name ?? "—"}
				</span>
			),
		},
		{
			id: "feature",
			header: "Feature",
			cell: (row) => (
				<span className="text-sm text-muted-foreground">
					{row.feature?.name ?? "—"}
				</span>
			),
		},
		{
			id: "usage",
			header: "Usage",
			className: "w-56",
			cell: (row) => {
				const percent = usagePercent(row);
				return (
					<div className="space-y-1">
						<div className="flex items-center justify-between text-xs tabular-nums">
							<span className="text-foreground">{formatNumber(row.used)}</span>
							<span className="text-muted-foreground">
								{row.limit === null ? "unlimited" : formatNumber(row.limit)}
							</span>
						</div>
						{row.limit !== null && <Progress value={percent} />}
					</div>
				);
			},
		},
		{
			id: "period",
			header: "Period",
			cell: (row) => (
				<span className="text-xs text-muted-foreground">
					{row.period ?? "—"}
				</span>
			),
		},
		{
			id: "reset",
			header: "Resets",
			cell: (row) => (
				<span className="whitespace-nowrap text-xs text-muted-foreground">
					{row.resetsAt ? formatDateTime(row.resetsAt) : "—"}
				</span>
			),
		},
		{
			id: "actions",
			header: "",
			className: "w-24 text-end",
			cell: (row) =>
				canEdit ? (
					<Button
						variant="ghost"
						size="sm"
						disabled={resetMutation.isPending}
						onClick={(event) => {
							event.stopPropagation();
							resetMutation.mutate(row.id);
						}}
					>
						<RotateCcw className="size-3.5" aria-hidden="true" />
						Reset
					</Button>
				) : null,
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Feature usage"
				description="How much of each plan feature every tenant has consumed."
				icon={Gauge}
				badge={<Badge variant="secondary">Billing period</Badge>}
			/>

			<AdminListTable
				columns={columns}
				rows={data?.items ?? []}
				getRowId={(row) => row.id}
				isLoading={isLoading}
				errorMessage={error instanceof Error ? error.message : null}
				emptyMessage="No usage counters recorded for this period."
				search={{
					value: searchInput,
					onValueChange: (value) => {
						setSearchInput(value);
						setPage(1);
					},
					placeholder: "Search by tenant or feature…",
				}}
				meta={data?.meta}
				onPageChange={setPage}
			/>
		</div>
	);
}
