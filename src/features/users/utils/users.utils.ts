// #/features/users/utils/users.utils.ts

import type {
	UserRecord,
	UserStatus,
} from "#/features/users/types/users.type.ts";
import { saveBlob } from "#/lib/download.ts";

/** Quotes a CSV cell and escapes embedded double quotes. */
function escapeCsv(value: string | number | null | undefined): string {
	const text = value === null || value === undefined ? "" : String(value);
	return `"${text.replaceAll('"', '""')}"`;
}

/** Converts users into a CSV document with a header row. */
export function usersToCsv(users: UserRecord[]): string {
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

	const rows = users.map((user) =>
		[
			user.id,
			user.name,
			user.company?.name ?? "",
			user.description ?? "",
			user.start_date ?? "",
			user.end_date ?? "",
			user.status,
		]
			.map(escapeCsv)
			.join(","),
	);

	return [header, ...rows].join("\r\n");
}

/** Downloads the visible users as a CSV file. */
export function downloadUsersCsv(users: UserRecord[]): void {
	saveBlob(
		new Blob([usersToCsv(users)], { type: "text/csv;charset=utf-8;" }),
		`users-${new Date().toISOString().slice(0, 10)}.csv`,
	);
}

/** Counts users per status for the summary cards. */
export function countUsersByStatus(
	users: UserRecord[],
): Record<UserStatus, number> {
	const counts: Record<UserStatus, number> = {
		draft: 0,
		active: 0,
		completed: 0,
		archived: 0,
	};

	for (const user of users) counts[user.status] += 1;
	return counts;
}
