// #/features/support/types/support.type.ts

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface CompanyRecord {
    id: string | number
    name?: string | null
}

export interface CompanyOption {
    id: string | number
    name?: string | null
}

/** A support ticket raised by a tenant school. */
export interface SupportRecord {
    id: string
    subject: string
    description?: string | null
    company_id?: string | null
    company?: CompanyRecord | null
    priority: TicketPriority
    status: TicketStatus
    opened_at?: string | null
    closed_at?: string | null
    assignee?: string | null
}
