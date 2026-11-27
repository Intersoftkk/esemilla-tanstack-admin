// #/features/support/server/support.server.ts
import { buildQueryParams } from '#/lib/query-builder.ts'
import {
    asRecord,
    readText,
    unwrapEntity,
    unwrapList,
} from '#/lib/payload.ts'
import type { PaginatedResponse } from '#/types'
import { api } from '#/server/api.server.ts'

import type { SupportListParams } from '#/features/support/schema/support-search.schema.ts'
import type { SupportFormData } from '#/features/support/schema/support-form.schema.ts'
import type {
    CompanyOption,
    SupportRecord,
    SupportStatus,
} from '#/features/support/types/support.ts'

// Laravel API resource for support.
const RESOURCE = '/support'

const SUPPORT_STATUSES: SupportStatus[] = [
    'draft',
    'active',
    'completed',
    'archived',
]

/** Maps an API status value onto the support status union. */
function normalizeStatus(value: unknown): SupportStatus {
    const status = readText(value)?.toLowerCase()
    return SUPPORT_STATUSES.find((item) => item === status) ?? 'draft'
}

/** Normalizes an API payload into a support record. */
export function normalizeSupport(value: unknown): SupportRecord | null {
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
        name: readText(record.name) ?? 'Untitled support',
        description: readText(record.description),
        start_date: readText(record.start_date, record.startDate),
        end_date: readText(record.end_date, record.endDate),
        status: normalizeStatus(record.status),
    }
}

/** Normalizes an API payload into a company option. */
function normalizeCompany(value: unknown): CompanyOption | null {
    const record = asRecord(value)
    const id = readText(record.id, record.uuid)
    if (!id) return null
    return { id, name: readText(record.name) }
}

/** Fetches a paginated list of support from the backend. */
export async function fetchSupportList(
    params: SupportListParams,
): Promise<PaginatedResponse<SupportRecord>> {
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
        .map(normalizeSupport)
        .filter((item): item is SupportRecord => item !== null)

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

/** Fetches a single support by ID. */
export async function fetchSupport(id: string): Promise<SupportRecord> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
    )
    const support = normalizeSupport(unwrapEntity(data) ?? data)
    if (!support) throw new Error('Support record could not be parsed.')
    return support
}

/** Creates a support in the backend. */
export async function createSupportRequest(
    payload: SupportFormData,
): Promise<SupportRecord> {
    const { data } = await api.post<unknown>(RESOURCE, payload)
    const support = normalizeSupport(unwrapEntity(data) ?? data)
    if (!support) throw new Error('Created support could not be parsed.')
    return support
}

/** Updates an existing support in the backend. */
export async function updateSupportRequest(
    id: string,
    payload: SupportFormData,
): Promise<SupportRecord> {
    const { data } = await api.put<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        payload,
    )
    const support = normalizeSupport(unwrapEntity(data) ?? data)
    if (!support) throw new Error('Updated support could not be parsed.')
    return support
}

/** Deletes a support from the backend. */
export async function deleteSupportRequest(id: string): Promise<void> {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
}

/** Fetches companies available for support assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
    try {
        const { data } = await api.get<unknown>('/companies', {
            params: { per_page: 100 },
        })
        return unwrapList(data)
            .map(normalizeCompany)
            .filter((item): item is CompanyOption => item !== null)
    } catch (error) {
        console.error('Failed to load companies for support:', error)
        return []
    }
}
