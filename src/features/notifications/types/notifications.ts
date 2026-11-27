// #/features/notifications/types/notifications.ts

export type NotificationStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface CompanyRecord {
    id: string | number
    name?: string | null
}

export interface NotificationRecord {
    id: string
    company_id: string
    company?: CompanyRecord | null
    name: string
    description?: string | null
    start_date?: string | null
    end_date?: string | null
    status: NotificationStatus
}

export interface CompanyOption {
    id: string | number
    name?: string | null
}
