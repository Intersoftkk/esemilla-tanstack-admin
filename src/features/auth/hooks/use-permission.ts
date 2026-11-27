// #/features/auth/hooks/use-permission.ts

import { useRouteContext } from '@tanstack/react-router'
import {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getAllUserPermissions,
} from '#/features/auth/utils/auth.ts'
import type { PermissionInput, RoleInput } from '#/features/auth/utils/auth.ts'
import type { User } from '#/features/auth/types/user.type.ts'

export function usePermission() {
  const { user } = useRouteContext({ from: '__root__' })
  const User = user as User | null | undefined

  return {
    user: User,
    isAuthenticated: Boolean(User),
    roles: User?.roles ?? [],
    permissions: getAllUserPermissions(User),
    hasRole: (role: RoleInput) => hasRole(User, role),
    hasAnyRole: (roles: RoleInput[]) => hasAnyRole(User, roles),
    hasAllRoles: (roles: RoleInput[]) => hasAllRoles(User, roles),
    hasPermission: (permission: PermissionInput) =>
      hasPermission(User, permission),
    hasAnyPermission: (permissions: PermissionInput[]) =>
      hasAnyPermission(User, permissions),
    hasAllPermissions: (permissions: PermissionInput[]) =>
      hasAllPermissions(User, permissions),
  }
}

/**
 * Formats a permission name into a readable label.
 * Handles dot notation, camelCase, and kebab-case.
 *
 * Examples:
 *  - "academic.attendance.delete" -> "Attendance Delete"
 *  - "exam-schedule-entry.create" -> "Schedule Entry Create"
 *  - "can-edit-user" -> "Edit User"
 */
export function formatPermissionName(name: string): string {
  if (!name) return ''

  // For namespaced permissions like 'academic.attendance.mark', strip the root module prefix
  const parts = name.split('.')
  const actionTarget = parts.length > 1 ? parts.slice(1).join(' ') : parts[0]

  return actionTarget
    .replace(/^can[_-]/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase support
    .replace(/[-_.]+/g, ' ') // kebab/snake/dot to space
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Formats module keys into clean display titles.
 *
 * Examples:
 *  - "docTemplate" -> "Doc Template"
 *  - "role-permission" -> "Role Permission"
 *  - "marksheet" -> "Marksheet"
 */
export function formatModuleName(module: string): string {
  if (!module) return ''

  return module
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/[-_.]+/g, ' ') // replace delimiters with space
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
