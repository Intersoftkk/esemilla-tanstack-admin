// #/features/auth/schema/role-permission-search.schema.ts

import { z } from 'zod'
import type { QueryBuilderInput } from '#/utils/query-builder.ts'

// ─────────────────────────────────────────────
// Shared preprocessors
// ─────────────────────────────────────────────

const stringArrayPreprocess = (val: unknown): string[] => {
  if (!Array.isArray(val)) return []
  return val.map((s) => String(s).trim()).filter(Boolean)
}

const sortPreprocess = (val: unknown): string[] => {
  if (Array.isArray(val))
    return val.map((s) => String(s).trim()).filter(Boolean)
  if (typeof val === 'string' && val.trim()) return [val.trim()]
  return []
}

const baseSearchSchema = z.object({
  search: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : ''),
    z.string(),
  ),
  pageIndex: z.preprocess((val) => (val ? Number(val) || 1 : 1), z.number()),
  pageSize: z.preprocess((val) => (val ? Number(val) || 10 : 10), z.number()),
  include: z.preprocess(stringArrayPreprocess, z.array(z.string())),
  sort: z.preprocess(sortPreprocess, z.array(z.string())),
})

// ─────────────────────────────────────────────
// ROLE SEARCH
// ─────────────────────────────────────────────

export const roleSearchSchema = baseSearchSchema

export type RoleSearch = z.infer<typeof roleSearchSchema>

export type RoleFilters = Pick<RoleSearch, 'search'>

export const EMPTY_ROLE_FILTERS: RoleFilters = {
  search: '',
}

export function mapRoleSearchToQuery(search: RoleSearch): QueryBuilderInput {
  return {
    page: search.pageIndex,
    perPage: search.pageSize,
    include: search.include.length ? search.include : undefined,
    sort: search.sort.length ? search.sort : undefined,
    filters: {
      search: search.search || undefined,
    },
  }
}

// ─────────────────────────────────────────────
// PERMISSION SEARCH
// ─────────────────────────────────────────────

export const permissionSearchSchema = baseSearchSchema

export type PermissionSearch = z.infer<typeof permissionSearchSchema>

export type PermissionFilters = Pick<PermissionSearch, 'search'>

export const EMPTY_PERMISSION_FILTERS: PermissionFilters = {
  search: '',
}

export function mapPermissionSearchToQuery(
  search: PermissionSearch,
): QueryBuilderInput {
  return {
    page: search.pageIndex,
    perPage: search.pageSize,
    include: search.include.length ? search.include : undefined,
    sort: search.sort.length ? search.sort : undefined,
    filters: {
      search: search.search || undefined,
    },
  }
}

// ─────────────────────────────────────────────
// ROLE PERMISSION SEARCH
// ─────────────────────────────────────────────

export const rolePermissionSearchSchema = baseSearchSchema.extend({
  role_id: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional(),
  ),
  permission_id: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional(),
  ),
})

export type RolePermissionSearch = z.infer<typeof rolePermissionSearchSchema>

export type RolePermissionFilters = Pick<
  RolePermissionSearch,
  'search' | 'role_id' | 'permission_id'
>

export const EMPTY_ROLE_PERMISSION_FILTERS: RolePermissionFilters = {
  search: '',
  role_id: undefined,
  permission_id: undefined,
}

export function mapRolePermissionSearchToQuery(
  search: RolePermissionSearch,
): QueryBuilderInput {
  return {
    page: search.pageIndex,
    perPage: search.pageSize,
    include: search.include.length ? search.include : undefined,
    sort: search.sort.length ? search.sort : undefined,
    filters: {
      search: search.search || undefined,
      role_id: search.role_id,
      permission_id: search.permission_id,
    },
  }
}

// ─────────────────────────────────────────────
// USER PERMISSION SEARCH
// ─────────────────────────────────────────────

export const userPermissionSearchSchema = baseSearchSchema.extend({
  user_id: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional(),
  ),
  permission_id: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional(),
  ),
})

export type UserPermissionSearch = z.infer<typeof userPermissionSearchSchema>

export type UserPermissionFilters = Pick<
  UserPermissionSearch,
  'search' | 'user_id' | 'permission_id'
>

export const EMPTY_USER_PERMISSION_FILTERS: UserPermissionFilters = {
  search: '',
  user_id: undefined,
  permission_id: undefined,
}

export function mapUserPermissionSearchToQuery(
  search: UserPermissionSearch,
): QueryBuilderInput {
  return {
    page: search.pageIndex,
    perPage: search.pageSize,
    include: search.include.length ? search.include : undefined,
    sort: search.sort.length ? search.sort : undefined,
    filters: {
      search: search.search || undefined,
      user_id: search.user_id,
      permission_id: search.permission_id,
    },
  }
}
