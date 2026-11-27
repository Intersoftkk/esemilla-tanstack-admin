// #/features/support/schema/support-search.schema.ts
import { z } from 'zod'

const multiSelect = z
    .array(z.string())
    .catch([])
    .transform((arr) => arr.map((s) => s.trim()).filter(Boolean))

export const supportSearchSchema = z.object({
    search: z.string().catch('').transform((s) => s.trim()),

    pageIndex: z.coerce.number().catch(1),
    pageSize: z.coerce.number().catch(10),

    company_ids: multiSelect,

    status: multiSelect,

    priority: multiSelect,

    sort: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .catch([])
        .transform((val) => {
            const arr = Array.isArray(val) ? val : val ? [val] : []
            return arr.map((s) => s.trim()).filter(Boolean)
        }),
})

export type SupportSearch = z.infer<typeof supportSearchSchema>

export type SupportFilters = {
    search: string
    company_ids: string[]
    status: string[]
    priority: string[]
}

export const EMPTY_SUPPORT_FILTERS: SupportFilters = {
    search: '',
    company_ids: [],
    status: [],
    priority: [],
}

/** Payload accepted by the support list server function. */
export const supportListParamsSchema = z.object({
    sorting: z
        .array(z.object({ id: z.string(), desc: z.boolean() }))
        .optional(),
    filters: z
        .object({
            search: z.string().optional(),
            company_ids: z.array(z.string()).optional(),
            status: z.array(z.string()).optional(),
            priority: z.array(z.string()).optional(),
        })
        .optional(),
    pagination: z
        .object({ pageIndex: z.number(), pageSize: z.number() })
        .optional(),
})

export type SupportListParams = z.infer<typeof supportListParamsSchema>
