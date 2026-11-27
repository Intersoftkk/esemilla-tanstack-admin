// #/features/role-permissions/server/role-permissions.server.ts

import type { RolePermissionFormData } from "#/features/role-permissions/schema/role-permissions-form.schema.ts";
import type { RolePermissionsListParams } from "#/features/role-permissions/schema/role-permissions-search.schema.ts";
import type {
	CompanyOption,
	RolePermissionRecord,
	RolePermissionStatus,
} from "#/features/role-permissions/types/role-permissions.type.ts";
import { asRecord, readText, unwrapEntity, unwrapList } from "#/lib/payload.ts";
import { buildQueryParams } from "#/lib/query-builder.ts";
import { api } from "#/server/api.server.ts";
import type { PaginatedResponse } from "#/types";

// Laravel API resource for rolePermissions.
const RESOURCE = "/role-permissions";

const ROLE_PERMISSION_STATUSES: RolePermissionStatus[] = [
	"draft",
	"active",
	"completed",
	"archived",
];

/** Maps an API status value onto the rolePermission status union. */
function normalizeStatus(value: unknown): RolePermissionStatus {
	const status = readText(value)?.toLowerCase();
	return ROLE_PERMISSION_STATUSES.find((item) => item === status) ?? "draft";
}

/** Normalizes an API payload into a rolePermission record. */
export function normalizeRolePermission(
	value: unknown,
): RolePermissionRecord | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	if (!id) return null;

	const company = asRecord(record.company);

	return {
		id,
		company_id:
			readText(record.company_id, record.companyId) ??
			readText(company.id) ??
			"",
		company: Object.keys(company).length
			? {
					id: readText(company.id) ?? "",
					name: readText(company.name),
				}
			: null,
		name: readText(record.name) ?? "Untitled rolePermission",
		description: readText(record.description),
		start_date: readText(record.start_date, record.startDate),
		end_date: readText(record.end_date, record.endDate),
		status: normalizeStatus(record.status),
	};
}

/** Normalizes an API payload into a company option. */
function normalizeCompany(value: unknown): CompanyOption | null {
	const record = asRecord(value);
	const id = readText(record.id, record.uuid);
	if (!id) return null;
	return { id, name: readText(record.name) };
}

/** Fetches a paginated list of rolePermissions from the backend. */
export async function fetchRolePermissions(
	params: RolePermissionsListParams,
): Promise<PaginatedResponse<RolePermissionRecord>> {
	const queryString = buildQueryParams({
		sorting: params.sorting,
		filters: params.filters,
		pagination: params.pagination,
	});

	const { data } = await api.get<unknown>(
		`${RESOURCE}${queryString ? `?${queryString}` : ""}`,
	);

	const root = asRecord(data);
	const envelope = asRecord(root.data);
	const payload = Object.keys(envelope).length ? envelope : root;
	const records = unwrapList(payload)
		.map(normalizeRolePermission)
		.filter((item): item is RolePermissionRecord => item !== null);

	const total = Number(payload.total ?? records.length);
	const perPage = Number(payload.per_page ?? params.pagination?.pageSize ?? 10);
	const currentPage = Number(payload.current_page ?? 1);

	return {
		current_page: currentPage,
		from: Number(payload.from ?? 0),
		last_page: Number(
			payload.last_page ?? Math.ceil(total / Math.max(perPage, 1)),
		),
		links: Array.isArray(payload.links) ? payload.links : [],
		path: readText(payload.path) ?? RESOURCE,
		per_page: perPage,
		to: Number(payload.to ?? 0),
		total,
		data: records,
	};
}

/** Fetches a single rolePermission by ID. */
export async function fetchRolePermission(
	id: string,
): Promise<RolePermissionRecord> {
	const { data } = await api.get<unknown>(
		`${RESOURCE}/${encodeURIComponent(id)}`,
	);
	const rolePermission = normalizeRolePermission(unwrapEntity(data) ?? data);
	if (!rolePermission)
		throw new Error("RolePermission record could not be parsed.");
	return rolePermission;
}

/** Creates a rolePermission in the backend. */
export async function createRolePermissionRequest(
	payload: RolePermissionFormData,
): Promise<RolePermissionRecord> {
	const { data } = await api.post<unknown>(RESOURCE, payload);
	const rolePermission = normalizeRolePermission(unwrapEntity(data) ?? data);
	if (!rolePermission)
		throw new Error("Created rolePermission could not be parsed.");
	return rolePermission;
}

/** Updates an existing rolePermission in the backend. */
export async function updateRolePermissionRequest(
	id: string,
	payload: RolePermissionFormData,
): Promise<RolePermissionRecord> {
	const { data } = await api.put<unknown>(
		`${RESOURCE}/${encodeURIComponent(id)}`,
		payload,
	);
	const rolePermission = normalizeRolePermission(unwrapEntity(data) ?? data);
	if (!rolePermission)
		throw new Error("Updated rolePermission could not be parsed.");
	return rolePermission;
}

/** Deletes a rolePermission from the backend. */
export async function deleteRolePermissionRequest(id: string): Promise<void> {
	await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`);
}

/** Fetches companies available for rolePermission assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
	try {
		const { data } = await api.get<unknown>("/companies", {
			params: { per_page: 100 },
		});
		return unwrapList(data)
			.map(normalizeCompany)
			.filter((item): item is CompanyOption => item !== null);
	} catch (error) {
		console.error("Failed to load companies for rolePermissions:", error);
		return [];
	}
}
