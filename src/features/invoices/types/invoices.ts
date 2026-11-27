// #/features/invoices/types/invoices.ts
import type { FeatureRecord } from '#/features/invoices/types/features.ts'

export type InvoiceStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface CompanyRecord {
    id: string | number
    name?: string | null
}

export interface InvoiceRecord {
    id: string
    company_id: string
    company?: CompanyRecord | null
    name: string
    description?: string | null
    start_date?: string | null
    end_date?: string | null
    status: InvoiceStatus
    features?: FeatureRecord[]
}

export interface CompanyOption {
    id: string | number
    name?: string | null
}
