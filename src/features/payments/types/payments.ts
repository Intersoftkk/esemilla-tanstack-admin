// #/features/payments/types/payments.ts

export type PaymentStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface CompanyRecord {
    id: string | number
    name?: string | null
}

export interface PaymentRecord {
    id: string
    company_id: string
    company?: CompanyRecord | null
    name: string
    description?: string | null
    start_date?: string | null
    end_date?: string | null
    status: PaymentStatus
}

export interface CompanyOption {
    id: string | number
    name?: string | null
}
