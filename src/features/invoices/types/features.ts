// #/features/invoices/types/features.ts

/** A feature that can be attached to an invoice via the Laravel `features` resource. */
export interface FeatureRecord {
    id: string
    name: string
    code?: string | null
    description?: string | null
}
