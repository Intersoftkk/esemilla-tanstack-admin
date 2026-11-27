// #/features/role-permissions/service/role-permissions.service.ts

import type { RolePermissionFormData } from "#/features/role-permissions/schema/role-permissions-form.schema.ts";
import type { RolePermissionsListParams } from "#/features/role-permissions/schema/role-permissions-search.schema.ts";
import {
	createRolePermissionFn,
	deleteRolePermissionFn,
	deleteRolePermissionsFn,
	getCompaniesFn,
	getRolePermissionsFn,
	updateRolePermissionFn,
} from "#/features/role-permissions/server/role-permissions.functions.ts";
import type { RolePermissionRecord } from "#/features/role-permissions/types/role-permissions.type.ts";
import type { PaginatedResponse } from "#/types";

/** Client-side wrappers around the server functions for the rolePermissions feature. */
export async function fetchPaginatedRolePermissions(
	params: RolePermissionsListParams,
): Promise<PaginatedResponse<RolePermissionRecord>> {
	return getRolePermissionsFn({ data: params });
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
	Awaited<ReturnType<typeof getCompaniesFn>>
> {
	return getCompaniesFn();
}

/** Client wrapper for creating a role permission. */
export async function createRolePermission(
	data: RolePermissionFormData,
): Promise<RolePermissionRecord> {
	return createRolePermissionFn({ data });
}

/** Client wrapper for updating a role permission. */
export async function updateRolePermission(
	id: string,
	data: RolePermissionFormData,
): Promise<RolePermissionRecord> {
	return updateRolePermissionFn({ data: { id, payload: data } });
}

/** Client wrapper for deleting a role permission. */
export async function deleteRolePermission(id: string): Promise<void> {
	await deleteRolePermissionFn({ data: id });
}

/** Client wrapper for deleting several rolePermissions. */
export async function deleteRolePermissions(ids: string[]): Promise<void> {
	await deleteRolePermissionsFn({ data: ids });
}
