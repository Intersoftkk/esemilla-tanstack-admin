// #/features/auth/schema/role-permission.schema.ts

import { z } from 'zod'

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

const idSchema = z.coerce.number().min(1, 'ID is required')

const searchBaseSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(100).optional().default(15),
  sort: z.string().optional(),
  include: z.array(z.string()).optional(),
  filters: z.record(z.string(), z.any()).optional(),
})

// ─────────────────────────────────────────────
// ROLE
// ─────────────────────────────────────────────

export const roleIdSchema = idSchema

export const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(100),
  description: z.string().optional(),
  guard_name: z.string().optional().default('web'),
  permissions: z.array(z.string()).optional(), // permission names
})

export type RoleFormData = z.infer<typeof roleSchema>

export const updateRoleSchema = z.object({
  id: roleIdSchema,
  payload: roleSchema.partial(),
})

export const getRoleByIdSchema = z.object({
  id: roleIdSchema,
  include: z.array(z.string()).optional(),
})

export const roleSearchSchema = searchBaseSchema

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
export type GetRoleByIdInput = z.infer<typeof getRoleByIdSchema>
export type RoleSearchInput = z.infer<typeof roleSearchSchema>

export function mapRoleSearchToQuery(data: RoleSearchInput) {
  return {
    filter: {
      search: data.search,
      ...data.filters,
    },
    page: {
      number: data.page,
      size: data.pageSize,
    },
    sort: data.sort,
    include: data.include,
  }
}

// ─────────────────────────────────────────────
// PERMISSION
// ─────────────────────────────────────────────

export const permissionIdSchema = idSchema

export const permissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required').max(100),
  description: z.string().optional(),
  guard_name: z.string().optional().default('web'),
})

export type PermissionFormData = z.infer<typeof permissionSchema>

export const updatePermissionSchema = z.object({
  id: permissionIdSchema,
  payload: permissionSchema.partial(),
})

export const getPermissionByIdSchema = z.object({
  id: permissionIdSchema,
  include: z.array(z.string()).optional(),
})

export const permissionSearchSchema = searchBaseSchema

export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>
export type GetPermissionByIdInput = z.infer<typeof getPermissionByIdSchema>
export type PermissionSearchInput = z.infer<typeof permissionSearchSchema>

export function mapPermissionSearchToQuery(data: PermissionSearchInput) {
  return {
    filter: {
      search: data.search,
      ...data.filters,
    },
    page: {
      number: data.page,
      size: data.pageSize,
    },
    sort: data.sort,
    include: data.include,
  }
}

// ─────────────────────────────────────────────
// ROLE PERMISSION (role ↔ permission assignment)
// ─────────────────────────────────────────────

export const rolePermissionIdSchema = idSchema

export const rolePermissionSchema = z.object({
  role_id: z.coerce.number().min(1, 'Role is required'),
  permission_ids: z
    .array(z.coerce.number())
    .min(1, 'At least one permission is required')
    .optional(),
  permissions: z.array(z.string()).optional(), // alternative: permission names
})

export type RolePermissionFormData = z.infer<typeof rolePermissionSchema>

export const updateRolePermissionSchema = z.object({
  id: rolePermissionIdSchema,
  payload: rolePermissionSchema.partial(),
})

export const getRolePermissionByIdSchema = z.object({
  id: rolePermissionIdSchema,
  include: z.array(z.string()).optional(),
})

export const rolePermissionSearchSchema = searchBaseSchema.extend({
  role_id: z.coerce.number().optional(),
  permission_id: z.coerce.number().optional(),
})

export type UpdateRolePermissionInput = z.infer<
  typeof updateRolePermissionSchema
>
export type GetRolePermissionByIdInput = z.infer<
  typeof getRolePermissionByIdSchema
>
export type RolePermissionSearchInput = z.infer<
  typeof rolePermissionSearchSchema
>

export function mapRolePermissionSearchToQuery(
  data: RolePermissionSearchInput,
) {
  return {
    filter: {
      search: data.search,
      role_id: data.role_id,
      permission_id: data.permission_id,
      ...data.filters,
    },
    page: {
      number: data.page,
      size: data.pageSize,
    },
    sort: data.sort,
    include: data.include,
  }
}

// ─────────────────────────────────────────────
// USER PERMISSION (user ↔ permission assignment)
// ─────────────────────────────────────────────

export const userPermissionIdSchema = idSchema

export const userPermissionSchema = z.object({
  user_id: z.coerce.number().min(1, 'User is required'),
  permission_ids: z
    .array(z.coerce.number())
    .min(1, 'At least one permission is required')
    .optional(),
  permissions: z.array(z.string()).optional(), // alternative: permission names
})

export type UserPermissionFormData = z.infer<typeof userPermissionSchema>

export const updateUserPermissionSchema = z.object({
  id: userPermissionIdSchema,
  payload: userPermissionSchema.partial(),
})

export const getUserPermissionByIdSchema = z.object({
  id: userPermissionIdSchema,
  include: z.array(z.string()).optional(),
})

export const userPermissionSearchSchema = searchBaseSchema.extend({
  user_id: z.coerce.number().optional(),
  permission_id: z.coerce.number().optional(),
})

export type UpdateUserPermissionInput = z.infer<
  typeof updateUserPermissionSchema
>
export type GetUserPermissionByIdInput = z.infer<
  typeof getUserPermissionByIdSchema
>
export type UserPermissionSearchInput = z.infer<
  typeof userPermissionSearchSchema
>
