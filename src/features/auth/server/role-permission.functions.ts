// #/features/auth/server/role-permission.functions.ts

import { createServerFn } from '@tanstack/react-start'
import {
  getRolePermissionByIdSchema,
  rolePermissionSearchSchema,
} from '#/features/auth/schema/role-permission.schema.ts'
import {
  fetchPaginatedRolePermissions,
  fetchRolePermissions,
  fetchRolePermissionById,
  syncRolePermissionsRequest,
  deleteRolePermissionRequest,
} from '#/features/auth/server/role-permission.server.ts'
import type { RolePermission } from '#/features/auth/types/role-permission.type.ts'
import type { PaginatedResponse } from '#/types'

export const getPaginatedRolePermissionsFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => rolePermissionSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<PaginatedResponse<RolePermission>> => {
    const { role_id, ...params } = data as {
      role_id?: number | string
    } & Record<string, unknown>
    return await fetchPaginatedRolePermissions(role_id ?? '', params)
  })

export const getRolePermissionsFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => rolePermissionSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<RolePermission[]> => {
    const { role_id, ...params } = data as {
      role_id?: number | string
    } & Record<string, unknown>
    return await fetchRolePermissions(role_id ?? '', params)
  })

export const getRolePermissionByIdFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => getRolePermissionByIdSchema.parse(data))
  .handler(async ({ data }): Promise<RolePermission> => {
    const { role_id, id, include } = data as {
      role_id?: number | string
      id: number | string
      include?: string[]
    }
    return await fetchRolePermissionById(role_id ?? '', id, { include })
  })

/** Sync / Bulk assign permissions to a role */
export const syncRolePermissionsFn = createServerFn({ method: 'POST' })
  .validator(
    (data: { role_id: number | string; permissions: string[] }) => data,
  )
  .handler(async ({ data }): Promise<RolePermission> => {
    return await syncRolePermissionsRequest(data.role_id, {
      permissions: data.permissions,
    })
  })

export const deleteRolePermissionFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => getRolePermissionByIdSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    const { role_id, id } = data as {
      role_id?: number | string
      id: number | string
    }
    return await deleteRolePermissionRequest(role_id ?? '', id)
  })
