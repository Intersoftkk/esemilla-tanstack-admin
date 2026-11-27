// #/features/auth/types/role-permission.type.ts

import type { User } from '#/features/auth/types/user.type.ts'

export type TargetType = 'role' | 'user'

export interface PermissionRecord {
  id: string
  name: string
  module: string
  guardName: string
  description?: string
}

export type GroupedPermissions = Record<string,Record<string, PermissionRecord[]>>

export interface Role {
  id: number
  name: string
  description?: string
  guardName: string
  permissions?: PermissionRecord[]
  createdAt?: string
  updatedAt?: string
}

export interface RolePermission {
  id: number
  roleId: number
  permissionId?: string
  role?: Role
  name?: string
  description?: string
  permissions?: PermissionRecord[]
  createdAt?: string
  updatedAt?: string
}

export interface UserPermission {
  id: number
  userId: number
  permissionId?: string
  user?: User
  permissions?: PermissionRecord[]
  createdAt?: string
  updatedAt?: string
}
