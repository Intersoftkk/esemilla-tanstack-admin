// #/features/support/schema/support-form.schema.ts
import { z } from 'zod'

export const supportSchema = z
    .object({
        company_id: z.string().min(1, 'Company is required'),
        subject: z.string().min(1, 'Subject is required').max(255),
        description: z.string().optional(),
        priority: z.enum(['low', 'normal', 'high', 'urgent']),
        status: z.enum(['open', 'pending', 'resolved', 'closed']),
        opened_at: z.string().min(1, 'Opened date is required'),
        closed_at: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.closed_at && data.closed_at < data.opened_at) {
            ctx.addIssue({
                code: 'custom',
                path: ['closed_at'],
                message: 'Closed date must be on or after the opened date',
            })
        }
    })

export type SupportFormData = z.infer<typeof supportSchema>
