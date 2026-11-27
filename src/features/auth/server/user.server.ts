// #/features/auth/server/user.server.ts

import { api } from '#/server/api.server.ts'
import { buildQueryString } from '#/utils/query-builder.ts'
import type { QueryBuilderInput } from '#/utils/query-builder.ts'
import type { User } from '#/features/auth/types/user.type.ts'
import type { UserCreateInput } from '#/features/auth/schema/user.schema.ts'
import type { PaginatedResponse } from '#/types'

/**
 * Fetch users list using Spatie QueryBuilder query parameters
 */
export async function fetchPaginatedUsers(
  params?: QueryBuilderInput,
): Promise<PaginatedResponse<User>> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<PaginatedResponse<User>>(
    `/user/users${qs}`,
  )
  return data
}

/**
 * Fetch users list using Spatie QueryBuilder query parameters
 */
export async function fetchUsers(
  params?: QueryBuilderInput,
): Promise<User[]> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<User[]>(
    `/user/users${qs}`,
  )
  return data
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(
  id: number,
  params?: Pick<QueryBuilderInput, 'include' | 'fields'>,
): Promise<User> {
  const qs = params ? buildQueryString(params) : ''
  const { data } = await api.get<{ data: User }>(
    `/user/users/${id}${qs}`,
  )
  return data.data
}

/**
 * Create a new user
 */
export async function createUserRequest(
  formData: UserCreateInput,
): Promise<User> {
  const { data } = await api.post<{ data: User }>(
    '/user/users',
    formData,
  )
  return data.data
}

/**
 * Update an existing user
 */
export async function updateUserRequest(
  id: number,
  formData: Partial<UserCreateInput>,
): Promise<User> {
  const { data } = await api.put<{ data: User }>(
    `/user/users/${id}`,
    formData,
  )
  return data.data
}

/**
 * Delete a user
 */
export async function deleteUserRequest(
  id: number,
): Promise<{ success: boolean }> {
  await api.delete(`/user/users/${id}`)
  return { success: true }
}
