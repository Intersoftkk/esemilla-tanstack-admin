// #/features/auth/server/permission.server.ts

import { api } from '#/server/api.server.ts'
import { buildQueryString } from '#/utils/query-builder.ts'
import type { QueryBuilderInput } from '#/utils/query-builder.ts'
import type {
  PermissionRecord,
  GroupedPermissions,
} from '#/features/auth/types/role-permission.types.ts'
import type { PermissionFormData } from '#/features/auth/schema/role-permission.schema.ts'

/**
 * Fetch permissions grouped by module using Spatie QueryBuilder query parameters
 */
export async function fetchPermissions(
  params?: QueryBuilderInput,
): Promise<GroupedPermissions> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<{ data: GroupedPermissions }>(
    `/user/permissions${qs}`,
  )
  return data.data
}

/**
 * Fetch a single permission by ID or UUID with optional includes
 */
export async function fetchPermissionById(
  id: number | string,
  params?: Pick<QueryBuilderInput, 'include' | 'fields'>,
): Promise<PermissionRecord> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<{ data: PermissionRecord }>(
    `/user/permissions/${id}${qs}`,
  )
  return data.data
}

/**
 * Create a new permission
 */
export async function createPermissionRequest(
  formData: PermissionFormData,
): Promise<PermissionRecord> {
  const { data } = await api.post<{ data: PermissionRecord }>(
    '/user/permissions',
    formData,
  )
  return data.data
}

/**
 * Update an existing permission
 */
export async function updatePermissionRequest(
  id: number | string,
  formData: Partial<PermissionFormData>,
): Promise<PermissionRecord> {
  const { data } = await api.put<{ data: PermissionRecord }>(
    `/user/permissions/${id}`,
    formData,
  )
  return data.data
}

/**
 * Delete an existing permission
 */
export async function deletePermissionRequest(
  id: number | string,
): Promise<{ success: boolean }> {
  await api.delete(`/user/permissions/${id}`)
  return { success: true }
}
