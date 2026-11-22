// #/features/auth/types/user.types.ts


import type { User } from '#/features/auth/types/user.types.ts'

export interface AuthSession {
  token: string
  user: User
  userId: string
  domain?: string
}
