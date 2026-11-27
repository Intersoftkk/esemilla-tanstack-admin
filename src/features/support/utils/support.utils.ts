// #/features/support/utils/support.utils.ts

import type {
	SupportRecord,
	TicketStatus,
} from "#/features/support/types/support.type.ts";
import { saveBlob } from "#/lib/download.ts";

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
	const text = value === null || value === undefined ? "" : String(value);
	return `"${text.replaceAll('"', '""')}"`;
}

/** Converts support tickets into a CSV document with a header row. */
export function supportToCsv(records: SupportRecord[]): string {
	const header = [
		"ID",
		"Subject",
		"Company",
		"Priority",
		"Status",
		"Assignee",
		"Opened",
		"Closed",
		"Description",
	]
		.map(escapeCsv)
		.join(",");

	const rows = records.map((record) =>
		[
			record.id,
			record.subject,
			record.company?.name ?? "",
			record.priority,
			record.status,
			record.assignee ?? "",
			record.opened_at ?? "",
			record.closed_at ?? "",
			record.description ?? "",
		]
			.map(escapeCsv)
			.join(","),
	);

	return [header, ...rows].join("\r\n");
}

/** Downloads the visible support tickets as a CSV file. */
export function downloadSupportCsv(records: SupportRecord[]): void {
	saveBlob(
		new Blob([supportToCsv(records)], { type: "text/csv;charset=utf-8;" }),
		`support-tickets-${new Date().toISOString().slice(0, 10)}.csv`,
	);
}

/** Counts support tickets per status for the summary cards. */
export function countSupportByStatus(
	records: SupportRecord[],
): Record<TicketStatus, number> {
	const counts: Record<TicketStatus, number> = {
		open: 0,
		pending: 0,
		resolved: 0,
		closed: 0,
	};

	for (const record of records) counts[record.status] += 1;
	return counts;
}
