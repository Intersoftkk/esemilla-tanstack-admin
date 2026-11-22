// #/features/auth/server/role.functions.ts

import { createServerFn } from '@tanstack/react-start'
import {
  roleSchema,
  roleSearchSchema,
  updateRoleSchema,
  getRoleByIdSchema,
} from '#/features/auth/schema/role-permission.schema.ts'
import {
  fetchPaginatedRoles,
  fetchRoles,
  fetchRoleById,
  createRoleRequest,
  updateRoleRequest,
  deleteRoleRequest,
} from '#/features/auth/server/role.server.ts'
import type { Role } from '#/features/auth/types/role-permission.types.ts'
import type { PaginatedResponse } from '#/types'

export const getPaginatedRolesFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => roleSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<PaginatedResponse<Role>> => {
    return await fetchPaginatedRoles(data)
  })

export const getRolesFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => roleSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<Role[]> => {
    return await fetchRoles(data)
  })

export const getRoleByIdFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => getRoleByIdSchema.parse(data))
  .handler(async ({ data }): Promise<Role> => {
    return await fetchRoleById(data.id, { include: data.include })
  })

export const createRoleFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => roleSchema.parse(data))
  .handler(async ({ data }): Promise<Role> => {
    return await createRoleRequest(data)
  })

export const updateRoleFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => updateRoleSchema.parse(data))
  .handler(async ({ data }): Promise<Role> => {
    const { id, payload } = data
    return await updateRoleRequest(id, payload)
  })

export const deleteRoleFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => getRoleByIdSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    return await deleteRoleRequest(data.id)
  })
