// #/features/role-permissions/server/role-permissions.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { rolePermissionSchema } from '#/features/role-permissions/schema/role-permissions-form.schema.ts'
import { rolePermissionsListParamsSchema } from '#/features/role-permissions/schema/role-permissions-search.schema.ts'
import {
    createRolePermissionRequest,
    deleteRolePermissionRequest,
    fetchCompanies,
    fetchRolePermission,
    fetchRolePermissions,
    updateRolePermissionRequest,
} from '#/features/role-permissions/server/role-permissions.server.ts'

const rolePermissionIdSchema = z.union([z.string(), z.number()]).transform(String)

const updateRolePermissionSchema = z.object({
    id: rolePermissionIdSchema,
    payload: rolePermissionSchema,
})

/** Server function: paginated rolePermissions list. */
export const getRolePermissionsFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => rolePermissionsListParamsSchema.parse(data ?? {}))
    .handler(async ({ data }) => fetchRolePermissions(data))

/** Server function: a single rolePermission by ID. */
export const getRolePermissionFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => rolePermissionIdSchema.parse(data))
    .handler(async ({ data: id }) => fetchRolePermission(id))

/** Server function: companies available for rolePermission assignment. */
export const getCompaniesFn = createServerFn({ method: 'GET' }).handler(
    async () => fetchCompanies(),
)

/** Server function: create a role permission. */
export const createRolePermissionFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => rolePermissionSchema.parse(data))
    .handler(async ({ data }) => createRolePermissionRequest(data))

/** Server function: update a role permission. */
export const updateRolePermissionFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => updateRolePermissionSchema.parse(data))
    .handler(async ({ data }) => updateRolePermissionRequest(data.id, data.payload))

/** Server function: delete a role permission. */
export const deleteRolePermissionFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => rolePermissionIdSchema.parse(data))
    .handler(async ({ data: id }) => deleteRolePermissionRequest(id))

/** Server function: delete several rolePermissions in one request. */
export const deleteRolePermissionsFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => z.array(rolePermissionIdSchema).min(1).parse(data))
    .handler(async ({ data: ids }) => {
        await Promise.all(ids.map((id) => deleteRolePermissionRequest(id)))
        return { deleted: ids.length }
    })
