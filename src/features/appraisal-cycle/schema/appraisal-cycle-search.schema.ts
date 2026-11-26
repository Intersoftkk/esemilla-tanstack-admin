import { z } from 'zod'

export const appraisalCycleSearchSchema = z.object({
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

export type AppraisalCycleSearch = z.infer<typeof appraisalCycleSearchSchema>

export type AppraisalCycleFilters = {
    search: string
    created_by_ids: string[]
    status: string[]
}

export const EMPTY_APPRAISAL_CYCLE_FILTERS: AppraisalCycleFilters = {
    search: '',
    created_by_ids: [],
    status: [],
}
