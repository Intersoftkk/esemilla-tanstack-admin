// #/features/admins/server/admins.server.ts
import type { AdminRecord } from "#/features/admins/types/admins.type.ts";
import {
	type AdminListParams,
	type AdminListResult,
	buildAdminListQuery,
} from "#/features/platform/schema/admin-list.schema.ts";
import {
	asRecord,
	readList,
	readText,
	unwrapPaginated,
} from "#/lib/payload.ts";
import { api } from "#/server/api.server.ts";

function normalizeRoleName(value: unknown): string | null {
	if (typeof value === "string") return value.trim() || null;
	const record = asRecord(value);
	return readText(record.name, record.title, record.slug);
}

/** Normalizes a central admin profile from the backend payload. */
export function normalizeAdmin(value: unknown): AdminRecord | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	if (!id) return null;

	return {
		id,
		name: readText(record.name, record.full_name),
		email: readText(record.email),
		status: readText(record.status, record.state) ?? "active",
		roles: readList(record.roles)
			.map(normalizeRoleName)
			.filter((role): role is string => Boolean(role)),
		lastLoginAt: readText(record.last_login_at, record.lastLoginAt),
		createdAt: readText(record.created_at, record.createdAt),
	};
}

/** `GET /admin/admins` */
export async function fetchAdmins(
	params: AdminListParams,
): Promise<AdminListResult<AdminRecord>> {
	const { data } = await api.get<unknown>("/admin/admins", {
		params: buildAdminListQuery(params),
	});

	const { items, meta } = unwrapPaginated(data, normalizeAdmin);
	return { items, meta };
}
