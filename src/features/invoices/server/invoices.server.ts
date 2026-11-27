// #/features/invoices/server/invoices.server.ts
import { buildQueryParams } from '#/lib/query-builder.ts'
import {
    asRecord,
    readList,
    readText,
    unwrapEntity,
    unwrapList,
} from '#/lib/payload.ts'
import type { PaginatedResponse } from '#/types'
import { api } from '#/server/api.server.ts'

import type { FeatureFormData } from '#/features/invoices/schema/features.schema.ts'
import type { InvoicesListParams } from '#/features/invoices/schema/invoices-search.schema.ts'
import type { InvoiceFormData } from '#/features/invoices/schema/invoices-form.schema.ts'
import type {
    CompanyOption,
    InvoiceRecord,
    InvoiceStatus,
} from '#/features/invoices/types/invoices.type.ts'
import type { FeatureRecord } from '#/features/invoices/types/features.type.ts'

// Laravel API resources for invoices and their features.
const RESOURCE = '/invoices'
const FEATURES_RESOURCE = '/features'

const INVOICE_STATUSES: InvoiceStatus[] = [
    'draft',
    'active',
    'completed',
    'archived',
]

/** Maps an API status value onto the invoice status union. */
function normalizeStatus(value: unknown): InvoiceStatus {
    const status = readText(value)?.toLowerCase()
    return INVOICE_STATUSES.find((item) => item === status) ?? 'draft'
}

/** Normalizes an API payload into a feature record. */
export function normalizeFeature(value: unknown): FeatureRecord | null {
    const record = asRecord(value)
    const id = readText(record.id, record.uuid)
    if (!id) return null

    return {
        id,
        name: readText(record.name) ?? `Feature ${id}`,
        code: readText(record.code, record.slug, record.key),
        description: readText(record.description),
    }
}

/** Normalizes an API payload into an invoice record. */
export function normalizeInvoice(value: unknown): InvoiceRecord | null {
    const record = asRecord(value)
    const id = readText(record.id, record.uuid)
    if (!id) return null

    const company = asRecord(record.company)

    return {
        id,
        company_id:
            readText(record.company_id, record.companyId) ??
            readText(company.id) ??
            '',
        company: Object.keys(company).length
            ? {
                  id: readText(company.id) ?? '',
                  name: readText(company.name),
              }
            : null,
        name: readText(record.name) ?? 'Untitled invoice',
        description: readText(record.description),
        start_date: readText(record.start_date, record.startDate),
        end_date: readText(record.end_date, record.endDate),
        status: normalizeStatus(record.status),
        features: readList(record.features)
            .map(normalizeFeature)
            .filter((item): item is FeatureRecord => item !== null),
    }
}

/** Normalizes an API payload into a company option. */
function normalizeCompany(value: unknown): CompanyOption | null {
    const record = asRecord(value)
    const id = readText(record.id, record.uuid)
    if (!id) return null
    return { id, name: readText(record.name) }
}

/** Fetches a paginated list of invoices from the backend. */
export async function fetchInvoices(
    params: InvoicesListParams,
): Promise<PaginatedResponse<InvoiceRecord>> {
    const queryString = buildQueryParams({
        sorting: params.sorting,
        filters: params.filters,
        pagination: params.pagination,
    })

    const { data } = await api.get<unknown>(
        `${RESOURCE}${queryString ? `?${queryString}` : ''}`,
    )

    const root = asRecord(data)
    const envelope = asRecord(root.data)
    const payload = Object.keys(envelope).length ? envelope : root
    const records = unwrapList(payload)
        .map(normalizeInvoice)
        .filter((item): item is InvoiceRecord => item !== null)

    const total = Number(payload.total ?? records.length)
    const perPage = Number(payload.per_page ?? params.pagination?.pageSize ?? 10)
    const currentPage = Number(payload.current_page ?? 1)

    return {
        current_page: currentPage,
        from: Number(payload.from ?? 0),
        last_page: Number(
            payload.last_page ?? Math.ceil(total / Math.max(perPage, 1)),
        ),
        links: Array.isArray(payload.links) ? payload.links : [],
        path: readText(payload.path) ?? RESOURCE,
        per_page: perPage,
        to: Number(payload.to ?? 0),
        total,
        data: records,
    }
}

/** Fetches a single invoice by ID. */
export async function fetchInvoice(id: string): Promise<InvoiceRecord> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
    )
    const invoice = normalizeInvoice(unwrapEntity(data) ?? data)
    if (!invoice) throw new Error('Invoice record could not be parsed.')
    return invoice
}

/** Creates an invoice in the backend. */
export async function createInvoiceRequest(
    payload: InvoiceFormData,
): Promise<InvoiceRecord> {
    const { data } = await api.post<unknown>(RESOURCE, payload)
    const invoice = normalizeInvoice(unwrapEntity(data) ?? data)
    if (!invoice) throw new Error('Created invoice could not be parsed.')
    return invoice
}

/** Updates an existing invoice in the backend. */
export async function updateInvoiceRequest(
    id: string,
    payload: InvoiceFormData,
): Promise<InvoiceRecord> {
    const { data } = await api.put<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        payload,
    )
    const invoice = normalizeInvoice(unwrapEntity(data) ?? data)
    if (!invoice) throw new Error('Updated invoice could not be parsed.')
    return invoice
}

/** Deletes an invoice from the backend. */
export async function deleteInvoiceRequest(id: string): Promise<void> {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
}

/** Fetches companies available for invoice assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
    try {
        const { data } = await api.get<unknown>('/companies', {
            params: { per_page: 100 },
        })
        return unwrapList(data)
            .map(normalizeCompany)
            .filter((item): item is CompanyOption => item !== null)
    } catch (error) {
        console.error('Failed to load companies for invoices:', error)
        return []
    }
}

/** Fetches the feature catalog from the Laravel `features` resource. */
export async function fetchFeatures(): Promise<FeatureRecord[]> {
    const { data } = await api.get<unknown>(FEATURES_RESOURCE, {
        params: { per_page: 100 },
    })

    return unwrapList(data)
        .map(normalizeFeature)
        .filter((item): item is FeatureRecord => item !== null)
}

/** Fetches the features currently assigned to an invoice. */
export async function fetchInvoiceFeatures(id: string): Promise<FeatureRecord[]> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        { params: { include: 'features' } },
    )

    const invoice = normalizeInvoice(unwrapEntity(data) ?? data)
    return invoice?.features ?? []
}

/** Attaches features to an invoice without removing existing ones. */
export async function attachInvoiceFeatures(
    id: string,
    featureIds: string[],
): Promise<InvoiceRecord> {
    const { data } = await api.post<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}/attach-features`,
        { feature_ids: featureIds },
    )

    return normalizeInvoice(unwrapEntity(data) ?? data) ?? fetchInvoice(id)
}

/** Replaces an invoice's features with exactly the given list. */
export async function syncInvoiceFeatures(
    id: string,
    featureIds: string[],
): Promise<InvoiceRecord> {
    const { data } = await api.post<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}/sync-features`,
        { feature_ids: featureIds },
    )

    return normalizeInvoice(unwrapEntity(data) ?? data) ?? fetchInvoice(id)
}


/** Creates a feature in the catalog. */
export async function createFeatureRequest(
    payload: FeatureFormData,
): Promise<FeatureRecord> {
    const { data } = await api.post<unknown>(FEATURES_RESOURCE, payload)
    const feature = normalizeFeature(unwrapEntity(data) ?? data)
    if (!feature) throw new Error('Created feature could not be parsed.')
    return feature
}

/** Updates a feature in the catalog. */
export async function updateFeatureRequest(
    id: string,
    payload: FeatureFormData,
): Promise<FeatureRecord> {
    const { data } = await api.put<unknown>(
        `${FEATURES_RESOURCE}/${encodeURIComponent(id)}`,
        payload,
    )
    const feature = normalizeFeature(unwrapEntity(data) ?? data)
    if (!feature) throw new Error('Updated feature could not be parsed.')
    return feature
}

/** Deletes a feature from the catalog. */
export async function deleteFeatureRequest(id: string): Promise<void> {
    await api.delete(`${FEATURES_RESOURCE}/${encodeURIComponent(id)}`)
}
