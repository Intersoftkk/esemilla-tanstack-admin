// #/features/settings/server/settings.server.ts
import type {
	SettingField,
	SettingGroup,
	SettingValue,
} from "#/features/settings/types/settings.type.ts";
import {
	asRecord,
	isRecord,
	readList,
	readText,
	unwrapList,
} from "#/lib/payload.ts";
import { api } from "#/server/api.server.ts";

function toSettingValue(value: unknown): SettingValue {
	if (typeof value === "boolean" || typeof value === "number") return value;
	if (typeof value === "string") return value;
	if (value === null || value === undefined) return "";
	return JSON.stringify(value);
}

function normalizeOptions(value: unknown): Array<string> {
	if (Array.isArray(value)) {
		return value
			.map((option) =>
				typeof option === "string"
					? option
					: readText(asRecord(option).value, asRecord(option).label),
			)
			.filter((option): option is string => Boolean(option));
	}
	if (isRecord(value)) return Object.keys(value);
	return [];
}

function normalizeField(value: unknown, groupKey: string): SettingField | null {
	const record = asRecord(value);
	const key = readText(record.key, record.name, record.slug);
	if (!key) return null;

	return {
		key,
		label:
			readText(record.label, record.title, record.name) ??
			key.replace(`${groupKey}.`, "").replace(/[._-]+/g, " "),
		type: readText(record.type, record.input_type)?.toLowerCase() ?? "string",
		value: toSettingValue(
			record.value ?? record.default ?? record.default_value,
		),
		description: readText(record.description, record.help),
		options: normalizeOptions(record.options),
	};
}

function normalizeGroup(value: unknown, index: number): SettingGroup | null {
	const record = asRecord(value);
	const key = readText(record.key, record.slug, record.name, record.group);
	const rawFields = readList(
		record.settings ?? record.fields ?? record.items ?? record.values,
	);
	const fields = rawFields
		.map((field) => normalizeField(field, key ?? `group-${index}`))
		.filter((field): field is SettingField => field !== null);

	if (!key && fields.length === 0) return null;

	return {
		key: key ?? `group-${index}`,
		label:
			readText(record.label, record.title) ??
			`${key ?? `Group ${index + 1}`}`.replace(/[._-]+/g, " "),
		description: readText(record.description),
		fields,
	};
}

/** `GET /v1/admin/settings/groups` */
export async function fetchSettingGroups(): Promise<Array<SettingGroup>> {
	const { data } = await api.get<unknown>("/v1/admin/settings/groups");

	// The endpoint answers with either a list of groups or a map of
	// `{ group: [settings…] }`; both normalise into the same shape.
	const root = isRecord(data) ? (isRecord(data.data) ? data.data : data) : null;

	if (root && Array.isArray(root.groups)) {
		return root.groups
			.map((group, index) => normalizeGroup(group, index))
			.filter((group): group is SettingGroup => group !== null);
	}

	if (root && !Array.isArray(data) && !Array.isArray(root.data)) {
		const entries = Object.entries(root).filter(([, value]) =>
			Array.isArray(value),
		);
		if (entries.length > 0) {
			return entries
				.map(
					([key, value], index) =>
						normalizeGroup({ key, settings: value }, index) ?? null,
				)
				.filter((group): group is SettingGroup => group !== null);
		}
	}

	return unwrapList(data)
		.map((group, index) => normalizeGroup(group, index))
		.filter((group): group is SettingGroup => group !== null);
}

/** `PUT /v1/admin/settings/bulk` */
export async function updateSettingsBulkRequest(
	changes: Array<{ key: string; value: SettingValue }>,
): Promise<void> {
	await api.put("/v1/admin/settings/bulk", { settings: changes });
}
