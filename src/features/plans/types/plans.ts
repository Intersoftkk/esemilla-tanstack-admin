// #/features/plans/types/plans.ts
export type PlanStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface CompanyRecord {
    id: string | number
    name?: string | null
}

/**
 * A plan is backed by the `performance-cycle` API resource. The UI was renamed
 * to "plans", but the backend endpoints deliberately keep their original path.
 */
export interface PlanRecord {
    id: string
    company_id: string
    company?: CompanyRecord | null
    name: string
    description?: string | null
    start_date?: string | null
    end_date?: string | null
    status: PlanStatus
}

export interface CompanyOption {
    id: string | number
    name?: string | null
}
