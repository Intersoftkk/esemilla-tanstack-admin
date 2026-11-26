import { z } from 'zod'

export const appraisalCycleSchema = z.object({
    company_id: z.string().min(1, 'company name is required'),
    name: z.string().min(1, 'Cycle name is required'),
    description: z.string().min(1, 'Cycle description is required'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    status: z.enum(['draft', 'active', 'completed', 'archived']),
})

export type AppraisalCycleFormData = z.infer<typeof appraisalCycleSchema>
