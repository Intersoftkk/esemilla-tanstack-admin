// #/features/auth/schema/user.schema.ts

import { z } from 'zod'

const idSchema = z.coerce.number().min(1, 'User ID is required')

export const userSearchSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(100).optional().default(15),
  sort: z.string().optional(),
  include: z.array(z.string()).optional(),
  filters: z.record(z.string(), z.any()).optional(),
})

export type UserSearchInput = z.infer<typeof userSearchSchema>

export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address').max(255),
  mobile: z.string().nullable().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  role_ids: z.array(z.coerce.number()).optional(),
})

export type UserCreateInput = z.infer<typeof userCreateSchema>

export const userUpdateSchema = z.object({
  id: idSchema,
  payload: userCreateSchema.partial().extend({
    password: z.string().min(8).optional(),
  }),
})

export type UserUpdateInput = z.infer<typeof userUpdateSchema>

export const getUserByIdSchema = z.object({
  id: idSchema,
  include: z.array(z.string()).optional(),
})

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>

/**
 * Maps frontend query parameters to Spatie QueryBuilder standards.
 */
export function mapUserSearchToQuery(data: UserSearchInput) {
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
