// #/features/auth/types/auth.type.ts


import type { User } from '#/features/auth/types/user.type.ts'

export interface AuthSession {
  token: string
  user: User
  userId: string
  domain?: string
}
