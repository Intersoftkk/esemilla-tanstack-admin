// #/features/auth/server/role-permission.server.ts

import { api } from '#/server/api.server.ts'
import { buildQueryString } from '#/utils/query-builder.ts'
import type { QueryBuilderInput } from '#/utils/query-builder.ts'
import type { PaginatedResponse } from '#/types'
import type { RolePermission } from '#/features/auth/types/role-permission.type.ts'
import type { RolePermissionFormData } from '#/features/auth/schema/role-permission.schema.ts'

/**
 * Fetch paginated permissions for a role
 * Route: GET /user/roles/{role}/permissions
 */
export async function fetchPaginatedRolePermissions(
  roleId: number | string,
  params?: QueryBuilderInput,
): Promise<PaginatedResponse<RolePermission>> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<PaginatedResponse<RolePermission>>(
    `/user/roles/${roleId}/permissions${qs}`,
  )
  return data
}

/**
 * Fetch all permissions assigned to a role (unpaginated)
 * Route: GET /user/roles/{role}/permissions
 */
export async function fetchRolePermissions(
  roleId: number | string,
  params?: QueryBuilderInput,
): Promise<RolePermission[]> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<RolePermission[]>(
    `/user/roles/${roleId}/permissions${qs}`,
  )
  return data
}

/**
 * Fetch a single permission assigned to a role by ID
 * Route: GET /user/roles/{role}/permissions/{permission}
 */
export async function fetchRolePermissionById(
  roleId: number | string,
  permissionId: number | string,
  params?: Pick<QueryBuilderInput, 'include' | 'fields'>,
): Promise<RolePermission> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<{ data: RolePermission }>(
    `/user/roles/${roleId}/permissions/${permissionId}${qs}`,
  )
  return data.data
}

/**
 * Create / Sync permissions for a role
 * Route: POST /user/roles/{role}/permissions
 */
export async function syncRolePermissionsRequest(
  roleId: number | string,
  formData: RolePermissionFormData | { permissions: string[] },
): Promise<RolePermission> {
  const { data } = await api.post<{ data: RolePermission }>(
    `/user/roles/${roleId}/permissions`,
    formData,
  )
  return data.data
}

/**
 * Remove a single permission from a role
 * Route: DELETE /user/roles/{role}/permissions/{permission}
 */
export async function deleteRolePermissionRequest(
  roleId: number | string,
  permissionId: number | string,
): Promise<{ success: boolean }> {
  await api.delete(
    `/user/roles/${roleId}/permissions/${permissionId}`,
  )
  return { success: true }
}