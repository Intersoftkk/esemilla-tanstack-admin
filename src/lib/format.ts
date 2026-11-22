import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";

/** Parses an ISO date string, returning `null` for missing/invalid input. */
export function toDate(value?: string | null): Date | null {
	if (!value) return null;
	const date = parseISO(value);
	return isValid(date) ? date : null;
}

export function formatCurrency(
	amount: number,
	currency = "USD",
	options: Intl.NumberFormatOptions = {},
): string {
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
			...options,
		}).format(amount);
	} catch {
		return `${currency} ${amount.toFixed(2)}`;
	}
}

export function formatNumber(value: number): string {
	return new Intl.NumberFormat("en-US", {
		maximumFractionDigits: 1,
	}).format(value);
}

export function formatCompactNumber(value: number): string {
	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

export function formatDate(
	value?: string | null,
	pattern = "dd MMM yyyy",
): string {
	const date = toDate(value);
	return date ? format(date, pattern) : "—";
}

export function formatDateTime(value?: string | null): string {
	return formatDate(value, "dd MMM yyyy, HH:mm");
}

/** `3 days ago`, `in 2 months` — falls back to an em dash. */
export function formatRelative(value?: string | null): string {
	const date = toDate(value);
	if (!date) return "—";

	try {
		return formatDistanceToNowStrict(date, { addSuffix: true });
	} catch {
		return "—";
	}
}

export function titleCase(value: string): string {
	return value
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, (character) => character.toUpperCase())
		.trim();
}

export function initials(name: string): string {
	const letters = name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase() ?? "")
		.join("");

	return letters || "?";
}

/** Human readable file size, e.g. `1.4 GB`, `820 MB`, `12 KB`. */
export function formatBytes(bytes: number, decimals = 1): string {
	if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

	const units = ["B", "KB", "MB", "GB", "TB"];
	const exponent = Math.min(
		units.length - 1,
		Math.floor(Math.log(bytes) / Math.log(1024)),
	);
	const value = bytes / 1024 ** exponent;
	const digits = exponent === 0 ? 0 : decimals;

	return `${Number(value.toFixed(digits))} ${units[exponent]}`;
}
