// #/features/plans/schema/plans-form.schema.ts
import { z } from 'zod'

export const planSchema = z.object({
    company_id: z.string().min(1, 'Company is required'),
    name: z.string().min(1, 'Plan name is required'),
    description: z.string().optional(),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    status: z.enum(['draft', 'active', 'completed', 'archived']),
})

export type PlanFormData = z.infer<typeof planSchema>
