// #/features/auth/server/user.functions.ts

import { createServerFn } from '@tanstack/react-start'
import {
  userSearchSchema,
  getUserByIdSchema,
  userCreateSchema,
  userUpdateSchema,
} from '#/features/auth/schema/user.schema.ts'
import {
  fetchUsers,
  fetchUserById,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
  fetchPaginatedUsers,
} from '#/features/auth/server/user.server.ts'
import type { User } from '#/features/auth/types/user.types.ts'
import type { PaginatedResponse } from '#/types'

export const getPaginatedUsersFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => userSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<PaginatedResponse<User>> => {
    return await fetchPaginatedUsers(data)
  })

export const getUsersFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => userSearchSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<User[]> => {
    return await fetchUsers(data)
  })

export const getUserByIdFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => getUserByIdSchema.parse(data))
  .handler(async ({ data }): Promise<User> => {
    return await fetchUserById(data.id, { include: data.include })
  })

export const createUserFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => userCreateSchema.parse(data))
  .handler(async ({ data }): Promise<User> => {
    return await createUserRequest(data)
  })

export const updateUserFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => userUpdateSchema.parse(data))
  .handler(async ({ data }): Promise<User> => {
    const { id, payload } = data
    return await updateUserRequest(id, payload)
  })

export const deleteUserFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => getUserByIdSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    return await deleteUserRequest(data.id)
  })
