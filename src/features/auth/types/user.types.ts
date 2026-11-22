// #/features/auth/types/user.types.ts

import type {
  Role,
  PermissionRecord,
} from '#/features/auth/types/role-permission.types.ts'

export interface User {
  id: string
  name: string
  email: string
  mobile: string | null
  avatar: string | null
  twoFactorEnabled?: boolean
  emailVerifiedAt: string | null
  mobileVerifiedAt: string | null

  /** Assigned roles to the user */
  roles?: Role[]

  /** Direct or aggregated permissions assigned to the user */
  permissions?: PermissionRecord[]
}

export interface AuthSession {
  token: string
  user: User
  userId: string
  domain?: string
}
