// #/features/auth/server/user-permission.server.ts

import { api } from '#/server/api.server.ts'
import { buildQueryString } from '#/utils/query-builder.ts'
import type { QueryBuilderInput } from '#/utils/query-builder.ts'
import type { PaginatedResponse } from '#/types'
import type { UserPermission } from '#/features/auth/types/role-permission.type.ts'
import type { UserPermissionFormData } from '#/features/auth/schema/role-permission.schema.ts'

/**
 * Fetch paginated permissions for a user
 * Route: GET /user/user/{user}/permissions
 */
export async function fetchPaginatedUserPermissions(
  userId: number | string,
  params?: QueryBuilderInput,
): Promise<PaginatedResponse<UserPermission>> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<PaginatedResponse<UserPermission>>(
    `/user/user/${userId}/permissions${qs}`,
  )
  return data
}

/**
 * Fetch all permissions assigned to a user (unpaginated)
 * Route: GET /user/user/{user}/permissions
 */
export async function fetchUserPermissions(
  userId: number | string,
  params?: QueryBuilderInput,
): Promise<UserPermission[]> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<UserPermission[]>(
    `/user/user/${userId}/permissions${qs}`,
  )
  return data
}

/**
 * Fetch a single permission assigned to a user by ID
 * Route: GET /user/user/{user}/permissions/{permission}
 */
export async function fetchUserPermissionById(
  userId: number | string,
  permissionId: number | string,
  params?: Pick<QueryBuilderInput, 'include' | 'fields'>,
): Promise<UserPermission> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<{ data: UserPermission }>(
    `/user/user/${userId}/permissions/${permissionId}${qs}`,
  )
  return data.data
}

/**
 * Create / Sync permissions for a user
 * Route: POST /user/user/{user}/permissions
 */
export async function syncUserPermissionsRequest(
  userId: number | string,
  formData: UserPermissionFormData | { permissions: string[] },
): Promise<UserPermission> {
  const { data } = await api.post<{ data: UserPermission }>(
    `/user/user/${userId}/permissions`,
    formData,
  )
  return data.data
}

/**
 * Remove a single permission from a user
 * Route: DELETE /user/user/{user}/permissions/{permission}
 */
export async function deleteUserPermissionRequest(
  userId: number | string,
  permissionId: number | string,
): Promise<{ success: boolean }> {
  await api.delete(`/user/user/${userId}/permissions/${permissionId}`)
  return { success: true }
}
