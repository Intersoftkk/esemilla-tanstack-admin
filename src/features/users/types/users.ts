// #/features/users/types/users.ts

export type UserStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface CompanyRecord {
    id: string | number
    name?: string | null
}

export interface UserRecord {
    id: string
    company_id: string
    company?: CompanyRecord | null
    name: string
    description?: string | null
    start_date?: string | null
    end_date?: string | null
    status: UserStatus
}

export interface CompanyOption {
    id: string | number
    name?: string | null
}
