// #/features/auth/server/user-permission.functions.ts

import { createServerFn } from '@tanstack/react-start'
import {
  getUserPermissionByIdSchema,
  userPermissionSearchSchema,
} from '#/features/auth/schema/role-permission.schema.ts'
import {
  fetchPaginatedUserPermissions,
  fetchUserPermissions,
  fetchUserPermissionById,
  syncUserPermissionsRequest,
  deleteUserPermissionRequest,
} from '#/features/auth/server/user-permission.server.ts'
import type { UserPermission } from '#/features/auth/types/role-permission.type.ts'
import type { PaginatedResponse } from '#/types'

export const getPaginatedUserPermissionsFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => userPermissionSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<PaginatedResponse<UserPermission>> => {
    const { user_id, ...params } = data as {
      user_id?: number | string
    } & Record<string, unknown>
    return await fetchPaginatedUserPermissions(user_id ?? '', params)
  })

export const getUserPermissionsFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => userPermissionSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<UserPermission[]> => {
    const { user_id, ...params } = data as {
      user_id?: number | string
    } & Record<string, unknown>
    return await fetchUserPermissions(user_id ?? '', params)
  })

export const getUserPermissionByIdFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => getUserPermissionByIdSchema.parse(data))
  .handler(async ({ data }): Promise<UserPermission> => {
    const { user_id, id, include } = data as {
      user_id?: number | string
      id: number | string
      include?: string[]
    }
    return await fetchUserPermissionById(user_id ?? '', id, { include })
  })

/** Sync / Bulk assign permissions to a user */
export const syncUserPermissionsFn = createServerFn({ method: 'POST' })
  .validator(
    (data: { user_id: number | string; permissions: string[] }) => data,
  )
  .handler(async ({ data }): Promise<UserPermission> => {
    return await syncUserPermissionsRequest(data.user_id, {
      permissions: data.permissions,
    })
  })

export const deleteUserPermissionFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => getUserPermissionByIdSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    const { user_id, id } = data as {
      user_id?: number | string
      id: number | string
    }
    return await deleteUserPermissionRequest(user_id ?? '', id)
  })
