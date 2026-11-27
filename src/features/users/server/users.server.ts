// #/features/users/server/users.server.ts
import { buildQueryParams } from '#/lib/query-builder.ts'
import {
    asRecord,
    readText,
    unwrapEntity,
    unwrapList,
} from '#/lib/payload.ts'
import type { PaginatedResponse } from '#/types'
import { api } from '#/server/api.server.ts'

import type { UsersListParams } from '#/features/users/schema/users-search.schema.ts'
import type { UserFormData } from '#/features/users/schema/users-form.schema.ts'
import type {
    CompanyOption,
    UserRecord,
    UserStatus,
} from '#/features/users/types/users.type.ts'

// Laravel API resource for users.
const RESOURCE = '/users'

const USER_STATUSES: UserStatus[] = [
    'draft',
    'active',
    'completed',
    'archived',
]

/** Maps an API status value onto the user status union. */
function normalizeStatus(value: unknown): UserStatus {
    const status = readText(value)?.toLowerCase()
    return USER_STATUSES.find((item) => item === status) ?? 'draft'
}

/** Normalizes an API payload into a user record. */
export function normalizeUser(value: unknown): UserRecord | null {
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
        name: readText(record.name) ?? 'Untitled user',
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

/** Fetches a paginated list of users from the backend. */
export async function fetchUsers(
    params: UsersListParams,
): Promise<PaginatedResponse<UserRecord>> {
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
        .map(normalizeUser)
        .filter((item): item is UserRecord => item !== null)

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

/** Fetches a single user by ID. */
export async function fetchUser(id: string): Promise<UserRecord> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
    )
    const user = normalizeUser(unwrapEntity(data) ?? data)
    if (!user) throw new Error('User record could not be parsed.')
    return user
}

/** Creates a user in the backend. */
export async function createUserRequest(
    payload: UserFormData,
): Promise<UserRecord> {
    const { data } = await api.post<unknown>(RESOURCE, payload)
    const user = normalizeUser(unwrapEntity(data) ?? data)
    if (!user) throw new Error('Created user could not be parsed.')
    return user
}

/** Updates an existing user in the backend. */
export async function updateUserRequest(
    id: string,
    payload: UserFormData,
): Promise<UserRecord> {
    const { data } = await api.put<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        payload,
    )
    const user = normalizeUser(unwrapEntity(data) ?? data)
    if (!user) throw new Error('Updated user could not be parsed.')
    return user
}

/** Deletes a user from the backend. */
export async function deleteUserRequest(id: string): Promise<void> {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
}

/** Fetches companies available for user assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
    try {
        const { data } = await api.get<unknown>('/companies', {
            params: { per_page: 100 },
        })
        return unwrapList(data)
            .map(normalizeCompany)
            .filter((item): item is CompanyOption => item !== null)
    } catch (error) {
        console.error('Failed to load companies for users:', error)
        return []
    }
}
