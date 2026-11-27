// #/features/role-permissions/types/role-permissions.ts

export type RolePermissionStatus = 'draft' | 'active' | 'completed' | 'archived'

export interface CompanyRecord {
    id: string | number
    name?: string | null
}

export interface RolePermissionRecord {
    id: string
    company_id: string
    company?: CompanyRecord | null
    name: string
    description?: string | null
    start_date?: string | null
    end_date?: string | null
    status: RolePermissionStatus
}

export interface CompanyOption {
    id: string | number
    name?: string | null
}
