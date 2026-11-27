// #/features/auth/server/role.server.ts

import { api } from '#/server/api.server.ts'
import { buildQueryString } from '#/utils/query-builder.ts'
import type { QueryBuilderInput } from '#/utils/query-builder.ts'
import type { PaginatedResponse } from '#/types'
import type { Role } from '#/features/auth/types/role-permission.type.ts'
import type { RoleFormData } from '#/features/auth/schema/role-permission.schema.ts'

/**
 * Fetch paginated roles using Spatie QueryBuilder query parameters
 */
export async function fetchPaginatedRoles(
  params?: QueryBuilderInput,
): Promise<PaginatedResponse<Role>> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<PaginatedResponse<Role>>(
    `/user/roles${qs}`,
  )
  return data
}

/**
 * Fetch all roles list (searchable / unpaginated) using Spatie QueryBuilder query parameters
 */
export async function fetchRoles(params?: QueryBuilderInput): Promise<Role[]> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<Role[]>(`/user/roles${qs}`)
  return data
}

/**
 * Fetch single role by ID with optional includes
 */
export async function fetchRoleById(
  id: number,
  params?: Pick<QueryBuilderInput, 'include' | 'fields'>,
): Promise<Role> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<{ data: Role }>(
    `/user/roles/${id}${qs}`,
  )
  return data.data
}

/**
 * Create a new role
 */
export async function createRoleRequest(formData: RoleFormData): Promise<Role> {
  const { data } = await api.post<{ data: Role }>(
    '/user/roles',
    formData,
  )
  return data.data
}

/**
 * Update an existing role
 */
export async function updateRoleRequest(
  id: number,
  formData: Partial<RoleFormData>,
): Promise<Role> {
  const { data } = await api.put<{ data: Role }>(
    `/user/roles/${id}`,
    formData,
  )
  return data.data
}

/**
 * Delete a role
 */
export async function deleteRoleRequest(
  id: number,
): Promise<{ success: boolean }> {
  await api.delete(`/user/roles/${id}`)
  return { success: true }
}
