// #/features/support/types/support.ts

export type SupportStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface CompanyRecord {
    id: string | number
    name?: string | null
}

export interface SupportRecord {
    id: string
    company_id: string
    company?: CompanyRecord | null
    name: string
    description?: string | null
    start_date?: string | null
    end_date?: string | null
    status: SupportStatus
}

export interface CompanyOption {
    id: string | number
    name?: string | null
}
