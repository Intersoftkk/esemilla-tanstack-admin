/**
 * Small helpers for reading API payloads defensively.
 *
 * Laravel endpoints in this project return a mix of plain arrays,
 * `{ data: ... }` resources and paginated envelopes, with snake_case or
 * camelCase keys depending on the resource version. Normalising once here keeps
 * every feature mapper short and predictable.
 */

export type RawRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is RawRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asRecord(value: unknown): RawRecord {
	return isRecord(value) ? value : {};
}

export function readText(...values: unknown[]): string | null {
	for (const value of values) {
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (trimmed.length) return trimmed;
		}
		if (typeof value === "number" && Number.isFinite(value)) {
			return String(value);
		}
	}
	return null;
}

export function readNumber(value: unknown, fallback = 0): number {
	const parsed =
		typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
	return Number.isFinite(parsed) ? parsed : fallback;
}

export function readBoolean(value: unknown): boolean {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value === 1;
	if (typeof value === "string") {
		return ["1", "true", "yes", "on"].includes(value.toLowerCase());
	}
	return false;
}

export function readList(value: unknown): unknown[] {
	if (Array.isArray(value)) return value;
	if (isRecord(value) && Array.isArray(value.data)) return value.data;
	return [];
}

/** Handles `[]`, `{ data: [] }` and `{ data: { data: [] } }`. */
export function unwrapList(payload: unknown): unknown[] {
	if (Array.isArray(payload)) return payload;

	const root = asRecord(payload);
	if (Array.isArray(root.data)) return root.data;

	const nested = asRecord(root.data);
	if (Array.isArray(nested.data)) return nested.data;

	return [];
}

/** Handles `{}`, `{ data: {} }` and `{ data: { data: {} } }`. */
export function unwrapEntity(payload: unknown): RawRecord | null {
	const root = asRecord(payload);
	if (!Object.keys(root).length) return null;

	const data = asRecord(root.data);
	if (Object.keys(data).length) {
		const deep = asRecord(data.data);
		return Object.keys(deep).length ? deep : data;
	}

	return root;
}

export interface PaginatedResult<T> {
	items: T[];
	meta: {
		total: number;
		page: number;
		perPage: number;
		lastPage: number;
	};
}

/** Normalises Laravel paginators (root or `meta`) alongside plain arrays. */
export function unwrapPaginated<T>(
	payload: unknown,
	map: (raw: unknown) => T | null,
): PaginatedResult<T> {
	const items = unwrapList(payload)
		.map(map)
		.filter((item): item is T => item !== null);

	const root = asRecord(payload);
	const meta = asRecord(root.meta);
	const total = readNumber(meta.total ?? root.total, items.length);
	const perPage = readNumber(meta.per_page ?? root.per_page, items.length || 1);
	const page = readNumber(meta.current_page ?? root.current_page, 1);
	const lastPage = readNumber(
		meta.last_page ?? root.last_page,
		Math.max(1, Math.ceil(total / Math.max(perPage, 1))),
	);

	return { items, meta: { total, page, perPage, lastPage } };
}
