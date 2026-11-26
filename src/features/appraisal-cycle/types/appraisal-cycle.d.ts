import {CompanyRecord} from "@/types/company";

export interface AppraisalCycleRecord {
    id: string
    company_id: string
    company: CompanyRecord
    name: string
    description?: string
    start_date: string
    end_date: string
    status: 'draft' | 'active' | 'completed' | 'archived'
}
