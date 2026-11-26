// #/features/plans/server/plans.server.ts
import { buildQueryParams } from '#/lib/query-builder.ts'
import { asRecord, readText, unwrapEntity, unwrapList } from '#/lib/payload.ts'
import type { PaginatedResponse } from '#/types'
import { api } from '#/server/api.server.ts'

import type { PlansListParams } from '#/features/plans/schema/plans-search.schema.ts'
import type { PlanFormData } from '#/features/plans/schema/plans-form.schema.ts'
import type {
    CompanyOption,
    PlanRecord,
    PlanStatus,
} from '#/features/plans/types/plans.ts'

// The backend resource keeps its historical name after the UI rename.
const RESOURCE = '/performance-cycle'

const PLAN_STATUSES: PlanStatus[] = [
    'draft',
    'active',
    'completed',
    'archived',
]

/** Maps an API status value onto the plan status union. */
function normalizeStatus(value: unknown): PlanStatus {
    const status = readText(value)?.toLowerCase()
    return PLAN_STATUSES.find((item) => item === status) ?? 'draft'
}

/** Normalizes an API payload into a plan record. */
export function normalizePlan(value: unknown): PlanRecord | null {
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
        name: readText(record.name) ?? 'Untitled plan',
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

/** Fetches a paginated list of plans from the backend. */
export async function fetchPlans(
    params: PlansListParams,
): Promise<PaginatedResponse<PlanRecord>> {
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
        .map(normalizePlan)
        .filter((item): item is PlanRecord => item !== null)

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

/** Fetches a single plan by ID. */
export async function fetchPlan(id: string): Promise<PlanRecord> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
    )
    const plan = normalizePlan(unwrapEntity(data) ?? data)
    if (!plan) throw new Error('Plan record could not be parsed.')
    return plan
}

/** Creates a plan in the backend. */
export async function createPlanRequest(
    payload: PlanFormData,
): Promise<PlanRecord> {
    const { data } = await api.post<unknown>(RESOURCE, payload)
    const plan = normalizePlan(unwrapEntity(data) ?? data)
    if (!plan) throw new Error('Created plan could not be parsed.')
    return plan
}

/** Updates an existing plan in the backend. */
export async function updatePlanRequest(
    id: string,
    payload: PlanFormData,
): Promise<PlanRecord> {
    const { data } = await api.put<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        payload,
    )
    const plan = normalizePlan(unwrapEntity(data) ?? data)
    if (!plan) throw new Error('Updated plan could not be parsed.')
    return plan
}

/** Deletes a plan from the backend. */
export async function deletePlanRequest(id: string): Promise<void> {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
}

/** Fetches companies available for plan assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
    try {
        const { data } = await api.get<unknown>('/companies', {
            params: { per_page: 100 },
        })
        return unwrapList(data)
            .map(normalizeCompany)
            .filter((item): item is CompanyOption => item !== null)
    } catch (error) {
        console.error('Failed to load companies for plans:', error)
        return []
    }
}
