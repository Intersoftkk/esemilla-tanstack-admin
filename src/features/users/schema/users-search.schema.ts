// #/features/users/schema/users-search.schema.ts
import { z } from 'zod'

export const userSearchSchema = z.object({
    search: z.string().catch('').transform((s) => s.trim()),

    pageIndex: z.coerce.number().catch(1),
    pageSize: z.coerce.number().catch(10),

    created_by_ids: z
        .array(z.string())
        .catch([])
        .transform((arr) => arr.map((s) => s.trim()).filter(Boolean)),

    status: z
        .array(z.string())
        .catch([])
        .transform((arr) => arr.map((s) => s.trim()).filter(Boolean)),

    sort: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .catch([])
        .transform((val) => {
            const arr = Array.isArray(val) ? val : val ? [val] : []
            return arr.map((s) => s.trim()).filter(Boolean)
        }),
})

export type UserSearch = z.infer<typeof userSearchSchema>

export type UserFilters = {
    search: string
    created_by_ids: string[]
    status: string[]
}

export const EMPTY_USER_FILTERS: UserFilters = {
    search: '',
    created_by_ids: [],
    status: [],
}

/** Payload accepted by the users list server function. */
export const usersListParamsSchema = z.object({
    sorting: z
        .array(z.object({ id: z.string(), desc: z.boolean() }))
        .optional(),
    filters: z
        .object({
            search: z.string().optional(),
            created_by_ids: z.array(z.string()).optional(),
            status: z.array(z.string()).optional(),
        })
        .optional(),
    pagination: z
        .object({ pageIndex: z.number(), pageSize: z.number() })
        .optional(),
})

export type UsersListParams = z.infer<typeof usersListParamsSchema>
