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
    TicketPriority,
    TicketStatus,
} from '#/features/support/types/support.type.ts'

// Laravel API resource for tenant support tickets.
const RESOURCE = '/support'

const TICKET_STATUSES: TicketStatus[] = [
    'open',
    'pending',
    'resolved',
    'closed',
]

const TICKET_PRIORITIES: TicketPriority[] = [
    'low',
    'normal',
    'high',
    'urgent',
]

/** Maps an API status value onto the ticket status union. */
function normalizeStatus(value: unknown): TicketStatus {
    const status = readText(value)?.toLowerCase()
    return TICKET_STATUSES.find((item) => item === status) ?? 'open'
}

/** Maps an API priority value onto the ticket priority union. */
function normalizePriority(value: unknown): TicketPriority {
    const priority = readText(value)?.toLowerCase()
    return TICKET_PRIORITIES.find((item) => item === priority) ?? 'normal'
}

/** Normalizes an API payload into a support ticket record. */
export function normalizeSupport(value: unknown): SupportRecord | null {
    const record = asRecord(value)
    const id = readText(record.id, record.uuid)
    if (!id) return null

    const company = asRecord(record.company)
    const assignee = asRecord(record.assignee ?? record.assigned_to)

    return {
        id,
        subject: readText(record.subject, record.name) ?? 'Untitled ticket',
        description: readText(record.description),
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
        priority: normalizePriority(record.priority),
        status: normalizeStatus(record.status),
        opened_at: readText(
            record.opened_at,
            record.openedAt,
            record.created_at,
            record.createdAt,
        ),
        closed_at: readText(
            record.closed_at,
            record.closedAt,
            record.resolved_at,
            record.resolvedAt,
        ),
        assignee: readText(
            record.assignee_name,
            record.assigneeName,
            assignee.name,
        ),
    }
}

/** Normalizes an API payload into a company option. */
function normalizeCompany(value: unknown): CompanyOption | null {
    const record = asRecord(value)
    const id = readText(record.id, record.uuid)
    if (!id) return null
    return { id, name: readText(record.name) }
}

/** Fetches a paginated list of support tickets from the backend. */
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

/** Fetches a single support ticket by ID. */
export async function fetchSupport(id: string): Promise<SupportRecord> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
    )
    const support = normalizeSupport(unwrapEntity(data) ?? data)
    if (!support) throw new Error('Support ticket could not be parsed.')
    return support
}

/** Raises a support ticket in the backend. */
export async function createSupportRequest(
    payload: SupportFormData,
): Promise<SupportRecord> {
    const { data } = await api.post<unknown>(RESOURCE, payload)
    const support = normalizeSupport(unwrapEntity(data) ?? data)
    if (!support) throw new Error('Created support ticket could not be parsed.')
    return support
}

/** Updates an existing support ticket in the backend. */
export async function updateSupportRequest(
    id: string,
    payload: SupportFormData,
): Promise<SupportRecord> {
    const { data } = await api.put<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        payload,
    )
    const support = normalizeSupport(unwrapEntity(data) ?? data)
    if (!support) throw new Error('Updated support ticket could not be parsed.')
    return support
}

/** Deletes a support ticket from the backend. */
export async function deleteSupportRequest(id: string): Promise<void> {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
}

/** Fetches companies available for ticket assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
    try {
        const { data } = await api.get<unknown>('/companies', {
            params: { per_page: 100 },
        })
        return unwrapList(data)
            .map(normalizeCompany)
            .filter((item): item is CompanyOption => item !== null)
    } catch (error) {
        console.error('Failed to load companies for support tickets:', error)
        return []
    }
}
