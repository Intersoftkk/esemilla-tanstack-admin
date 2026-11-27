// #/features/subscriptions/utils/subscriptions.utils.ts

import type {
	SubscriptionRecord,
	SubscriptionStatus,
} from "#/features/subscriptions/types/subscriptions.type.ts";
import { saveBlob } from "#/lib/download.ts";

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
	const text = value === null || value === undefined ? "" : String(value);
	return `"${text.replaceAll('"', '""')}"`;
}

/** Converts subscriptions into a CSV document with a header row. */
export function subscriptionsToCsv(
	subscriptions: SubscriptionRecord[],
): string {
	const header = [
		"ID",
		"Name",
		"Company",
		"Description",
		"Start Date",
		"End Date",
		"Status",
	]
		.map(escapeCsv)
		.join(",");

	const rows = subscriptions.map((subscription) =>
		[
			subscription.id,
			subscription.name,
			subscription.company?.name ?? "",
			subscription.description ?? "",
			subscription.start_date ?? "",
			subscription.end_date ?? "",
			subscription.status,
		]
			.map(escapeCsv)
			.join(","),
	);

	return [header, ...rows].join("\r\n");
}

/** Downloads the visible subscriptions as a CSV file. */
export function downloadSubscriptionsCsv(
	subscriptions: SubscriptionRecord[],
): void {
	saveBlob(
		new Blob([subscriptionsToCsv(subscriptions)], {
			type: "text/csv;charset=utf-8;",
		}),
		`subscriptions-${new Date().toISOString().slice(0, 10)}.csv`,
	);
}

/** Counts subscriptions per status for the summary cards. */
export function countSubscriptionsByStatus(
	subscriptions: SubscriptionRecord[],
): Record<SubscriptionStatus, number> {
	const counts: Record<SubscriptionStatus, number> = {
		draft: 0,
		active: 0,
		completed: 0,
		archived: 0,
	};

	for (const subscription of subscriptions) counts[subscription.status] += 1;
	return counts;
}
