// #/features/subscriptions/server/subscriptions.server.ts
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

import type { FeatureFormData } from '#/features/subscriptions/schema/features.schema.ts'
import type { SubscriptionsListParams } from '#/features/subscriptions/schema/subscriptions-search.schema.ts'
import type { SubscriptionFormData } from '#/features/subscriptions/schema/subscriptions-form.schema.ts'
import type {
    CompanyOption,
    SubscriptionRecord,
    SubscriptionStatus,
} from '#/features/subscriptions/types/subscriptions.type.ts'
import type { FeatureRecord } from '#/features/subscriptions/types/features.type.ts'

// Laravel API resources for subscriptions and their features.
const RESOURCE = '/subscriptions'
const FEATURES_RESOURCE = '/features'

const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
    'draft',
    'active',
    'completed',
    'archived',
]

/** Maps an API status value onto the subscription status union. */
function normalizeStatus(value: unknown): SubscriptionStatus {
    const status = readText(value)?.toLowerCase()
    return SUBSCRIPTION_STATUSES.find((item) => item === status) ?? 'draft'
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

/** Normalizes an API payload into a subscription record. */
export function normalizeSubscription(value: unknown): SubscriptionRecord | null {
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
        name: readText(record.name) ?? 'Untitled subscription',
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

/** Fetches a paginated list of subscriptions from the backend. */
export async function fetchSubscriptions(
    params: SubscriptionsListParams,
): Promise<PaginatedResponse<SubscriptionRecord>> {
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
        .map(normalizeSubscription)
        .filter((item): item is SubscriptionRecord => item !== null)

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

/** Fetches a single subscription by ID. */
export async function fetchSubscription(id: string): Promise<SubscriptionRecord> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
    )
    const subscription = normalizeSubscription(unwrapEntity(data) ?? data)
    if (!subscription) throw new Error('Subscription record could not be parsed.')
    return subscription
}

/** Creates a subscription in the backend. */
export async function createSubscriptionRequest(
    payload: SubscriptionFormData,
): Promise<SubscriptionRecord> {
    const { data } = await api.post<unknown>(RESOURCE, payload)
    const subscription = normalizeSubscription(unwrapEntity(data) ?? data)
    if (!subscription) throw new Error('Created subscription could not be parsed.')
    return subscription
}

/** Updates an existing subscription in the backend. */
export async function updateSubscriptionRequest(
    id: string,
    payload: SubscriptionFormData,
): Promise<SubscriptionRecord> {
    const { data } = await api.put<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        payload,
    )
    const subscription = normalizeSubscription(unwrapEntity(data) ?? data)
    if (!subscription) throw new Error('Updated subscription could not be parsed.')
    return subscription
}

/** Deletes a subscription from the backend. */
export async function deleteSubscriptionRequest(id: string): Promise<void> {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
}

/** Fetches companies available for subscription assignment. */
export async function fetchCompanies(): Promise<CompanyOption[]> {
    try {
        const { data } = await api.get<unknown>('/companies', {
            params: { per_page: 100 },
        })
        return unwrapList(data)
            .map(normalizeCompany)
            .filter((item): item is CompanyOption => item !== null)
    } catch (error) {
        console.error('Failed to load companies for subscriptions:', error)
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

/** Fetches the features currently assigned to a subscription. */
export async function fetchSubscriptionFeatures(id: string): Promise<FeatureRecord[]> {
    const { data } = await api.get<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}`,
        { params: { include: 'features' } },
    )

    const subscription = normalizeSubscription(unwrapEntity(data) ?? data)
    return subscription?.features ?? []
}

/** Attaches features to a subscription without removing existing ones. */
export async function attachSubscriptionFeatures(
    id: string,
    featureIds: string[],
): Promise<SubscriptionRecord> {
    const { data } = await api.post<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}/attach-features`,
        { feature_ids: featureIds },
    )

    return normalizeSubscription(unwrapEntity(data) ?? data) ?? fetchSubscription(id)
}

/** Replaces a subscription's features with exactly the given list. */
export async function syncSubscriptionFeatures(
    id: string,
    featureIds: string[],
): Promise<SubscriptionRecord> {
    const { data } = await api.post<unknown>(
        `${RESOURCE}/${encodeURIComponent(id)}/sync-features`,
        { feature_ids: featureIds },
    )

    return normalizeSubscription(unwrapEntity(data) ?? data) ?? fetchSubscription(id)
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
