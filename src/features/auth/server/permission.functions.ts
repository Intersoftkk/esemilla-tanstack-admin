// #/features/auth/server/permission.functions.ts

import { createServerFn } from '@tanstack/react-start'
import {
  permissionSchema,
  permissionSearchSchema,
  updatePermissionSchema,
  getPermissionByIdSchema,
} from '#/features/auth/schema/role-permission.schema.ts'
import {
  fetchPermissions,
  fetchPermissionById,
  createPermissionRequest,
  updatePermissionRequest,
  deletePermissionRequest,
} from '#/features/auth/server/permission.server.ts'
import type {
  PermissionRecord,
  GroupedPermissions,
} from '#/features/auth/types/role-permission.types.ts'

export const getPermissionsFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => permissionSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<GroupedPermissions> => {
    return await fetchPermissions(data)
  })

export const getPermissionByIdFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => getPermissionByIdSchema.parse(data))
  .handler(async ({ data }): Promise<PermissionRecord> => {
    return await fetchPermissionById(data.id, { include: data.include })
  })

export const createPermissionFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => permissionSchema.parse(data))
  .handler(async ({ data }): Promise<PermissionRecord> => {
    return await createPermissionRequest(data)
  })

export const updatePermissionFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => updatePermissionSchema.parse(data))
  .handler(async ({ data }): Promise<PermissionRecord> => {
    const { id, payload } = data
    return await updatePermissionRequest(id, payload)
  })

export const deletePermissionFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => getPermissionByIdSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    return await deletePermissionRequest(data.id)
  })
