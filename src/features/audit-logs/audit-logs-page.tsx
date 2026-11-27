// #/features/audit-logs/audit-logs-page.tsx
import { useQuery } from "@tanstack/react-query";
import { History, ScrollText } from "lucide-react";
import { useDeferredValue, useState } from "react";

import {
	type AdminListColumn,
	AdminListTable,
} from "#/components/datatable/admin-list-table.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import {
	getAuditLogsFn,
	getRecordAuditLogsFn,
} from "#/features/audit-logs/server/audit-logs.functions.ts";
import type { AuditLogRecord } from "#/features/audit-logs/types/audit-logs.type.ts";
import { formatDateTime, formatRelative } from "#/lib/format.ts";

const EVENT_VARIANTS: Record<
	string,
	"default" | "secondary" | "destructive" | "outline"
> = {
	created: "default",
	updated: "secondary",
	deleted: "destructive",
	restored: "outline",
};

function eventVariant(event: string) {
	return EVENT_VARIANTS[event.toLowerCase()] ?? "outline";
}

/** Audit trail of every platform action, served by `/v1/admin/audit-logs`. */
export function AuditLogsPage() {
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const search = useDeferredValue(searchInput);
	const [selected, setSelected] = useState<AuditLogRecord | null>(null);
	const [showRecordHistory, setShowRecordHistory] = useState(false);

	const { data, isLoading, error } = useQuery({
		queryKey: ["audit-logs", { page, search }],
		queryFn: () =>
			getAuditLogsFn({
				data: { page, perPage: 20, search: search.trim() || undefined },
			}),
		placeholderData: (previous) => previous,
	});

	const recordHistory = useQuery({
		queryKey: [
			"audit-logs",
			"record",
			selected?.subjectType,
			selected?.subjectId,
		],
		queryFn: () =>
			getRecordAuditLogsFn({
				data: {
					type: selected?.subjectType ?? "",
					id: selected?.subjectId ?? "",
				},
			}),
		enabled:
			showRecordHistory &&
			Boolean(selected?.subjectType && selected?.subjectId),
	});

	const columns: Array<AdminListColumn<AuditLogRecord>> = [
		{
			id: "createdAt",
			header: "When",
			cell: (row) => (
				<span className="whitespace-nowrap text-xs text-muted-foreground">
					{formatDateTime(row.createdAt)}
				</span>
			),
		},
		{
			id: "event",
			header: "Event",
			cell: (row) => (
				<Badge variant={eventVariant(row.event)} className="capitalize">
					{row.event}
				</Badge>
			),
		},
		{
			id: "actor",
			header: "Actor",
			cell: (row) => (
				<div className="min-w-0">
					<p className="truncate text-sm text-foreground">
						{row.actor?.name ?? "System"}
					</p>
					{row.actor?.email && (
						<p className="truncate text-[11px] text-muted-foreground">
							{row.actor.email}
						</p>
					)}
				</div>
			),
		},
		{
			id: "subject",
			header: "Record",
			cell: (row) => (
				<span className="font-mono text-[11px] text-muted-foreground">
					{row.subjectType
						? `${row.subjectType}${row.subjectId ? ` #${row.subjectId}` : ""}`
						: "—"}
				</span>
			),
		},
		{
			id: "description",
			header: "Summary",
			className: "max-w-[22rem]",
			cell: (row) => (
				<span className="block truncate text-sm text-muted-foreground">
					{row.description ?? "—"}
				</span>
			),
		},
		{
			id: "ip",
			header: "IP",
			cell: (row) => (
				<span className="font-mono text-[11px] text-muted-foreground">
					{row.ipAddress ?? "—"}
				</span>
			),
		},
	];

	const closeDialog = () => {
		setSelected(null);
		setShowRecordHistory(false);
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Audit log"
				description="Every platform action, who performed it and what changed."
				icon={ScrollText}
				badge={<Badge variant="secondary">Read only</Badge>}
			/>

			<AdminListTable
				columns={columns}
				rows={data?.items ?? []}
				getRowId={(row) => row.id}
				isLoading={isLoading}
				errorMessage={error instanceof Error ? error.message : null}
				emptyMessage="No audit entries match this search."
				search={{
					value: searchInput,
					onValueChange: (value) => {
						setSearchInput(value);
						setPage(1);
					},
					placeholder: "Search the audit trail…",
				}}
				meta={data?.meta}
				onPageChange={setPage}
				onRowClick={setSelected}
			/>

			<Dialog
				open={Boolean(selected)}
				onOpenChange={(open) => {
					if (!open) closeDialog();
				}}
			>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle className="capitalize">
							{selected?.event} · {selected?.subjectType ?? "Platform"}
						</DialogTitle>
						<DialogDescription>
							{selected?.description ??
								"Audit entry recorded by the platform API."}
						</DialogDescription>
					</DialogHeader>

					<dl className="grid grid-cols-2 gap-3 text-sm">
						<div>
							<dt className="text-[11px] font-semibold uppercase text-muted-foreground">
								Actor
							</dt>
							<dd>{selected?.actor?.name ?? "System"}</dd>
						</div>
						<div>
							<dt className="text-[11px] font-semibold uppercase text-muted-foreground">
								When
							</dt>
							<dd>
								{formatDateTime(selected?.createdAt)}
								<span className="ms-1 text-xs text-muted-foreground">
									({formatRelative(selected?.createdAt)})
								</span>
							</dd>
						</div>
						<div>
							<dt className="text-[11px] font-semibold uppercase text-muted-foreground">
								Record
							</dt>
							<dd className="font-mono text-xs">
								{selected?.subjectType ?? "—"}
								{selected?.subjectId ? ` #${selected.subjectId}` : ""}
							</dd>
						</div>
						<div>
							<dt className="text-[11px] font-semibold uppercase text-muted-foreground">
								IP address
							</dt>
							<dd className="font-mono text-xs">
								{selected?.ipAddress ?? "—"}
							</dd>
						</div>
					</dl>

					<div>
						<p className="text-[11px] font-semibold uppercase text-muted-foreground">
							Changes
						</p>
						<pre className="mt-1.5 max-h-56 overflow-auto rounded-lg border border-border/70 bg-muted/40 p-3 text-[11px] leading-5">
							{selected?.changes ?? "No field changes recorded."}
						</pre>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between gap-2">
							<p className="text-[11px] font-semibold uppercase text-muted-foreground">
								Full history of this record
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowRecordHistory((value) => !value)}
								disabled={!selected?.subjectType || !selected?.subjectId}
							>
								<History className="size-3.5" aria-hidden="true" />
								{showRecordHistory ? "Hide" : "Load history"}
							</Button>
						</div>

						{showRecordHistory && (
							<div className="max-h-48 space-y-1.5 overflow-auto">
								{recordHistory.isLoading && (
									<Skeleton className="h-10 w-full" />
								)}
								{recordHistory.data?.map((entry) => (
									<div
										key={entry.id}
										className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-2.5 py-1.5 text-xs"
									>
										<span className="capitalize">{entry.event}</span>
										<span className="text-muted-foreground">
											{formatDateTime(entry.createdAt)}
										</span>
									</div>
								))}
								{recordHistory.data?.length === 0 && (
									<p className="text-xs text-muted-foreground">
										No other entries for this record.
									</p>
								)}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
