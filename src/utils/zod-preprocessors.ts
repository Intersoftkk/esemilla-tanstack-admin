// src/utils/zod-preprocessors.ts

/**
 * Ensures the value is a trimmed string. Defaults to an empty string.
 */
export const stringPreprocess = (val: unknown): string => {
	return typeof val === "string" ? val.trim() : "";
};

/**
 * Handles query string arrays (e.g., `?status=active` or `?status=active&status=archived`).
 * Converts single strings or string arrays into a cleaned, non-empty array of strings.
 */
export const arrayPreprocess = (val: unknown): string[] => {
	if (!val) return [];
	if (Array.isArray(val))
		return val.map((s) => String(s).trim()).filter(Boolean);
	if (typeof val === "string" && val.trim()) return [val.trim()];
	return [];
};

/**
 * Parses numeric values safely from query strings.
 * Falls back to the provided default if missing, invalid, or <= 0.
 */
export const numberPreprocess = (val: unknown, fallback: number): number => {
	const parsed = Number(val);
	return !Number.isNaN(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Parses boolean query string values (e.g., 'true', '1', 'false', '0').
 */
export const booleanPreprocess = (val: unknown): boolean | undefined => {
	if (val === "true" || val === true || val === 1 || val === "1") return true;
	if (val === "false" || val === false || val === 0 || val === "0")
		return false;
	return undefined;
};
