// #/features/subscriptions/service/subscriptions.service.ts
import type { PaginatedResponse } from '#/types'

import type { SubscriptionFormData } from '#/features/subscriptions/schema/subscriptions-form.schema.ts'
import type {
    SubscriptionsListParams,
} from '#/features/subscriptions/schema/subscriptions-search.schema.ts'
import type { SubscriptionRecord } from '#/features/subscriptions/types/subscriptions.type.ts'
import {
    attachSubscriptionFeaturesFn,
    createFeatureFn,
    createSubscriptionFn,
    deleteFeatureFn,
    deleteSubscriptionFn,
    deleteSubscriptionsFn,
    getCompaniesFn,
    getFeaturesFn,
    getSubscriptionFeaturesFn,
    getSubscriptionsFn,
    syncSubscriptionFeaturesFn,
    updateFeatureFn,
    updateSubscriptionFn,
} from '#/features/subscriptions/server/subscriptions.functions.ts'
import type { FeatureFormData } from '#/features/subscriptions/schema/features.schema.ts'
import type { FeatureRecord } from '#/features/subscriptions/types/features.type.ts'

/** Client-side wrappers around the server functions for the subscriptions feature. */
export async function fetchPaginatedSubscriptions(
    params: SubscriptionsListParams,
): Promise<PaginatedResponse<SubscriptionRecord>> {
    return getSubscriptionsFn({ data: params })
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
    Awaited<ReturnType<typeof getCompaniesFn>>
> {
    return getCompaniesFn()
}

/** Client wrapper for creating a subscription. */
export async function createSubscription(
    data: SubscriptionFormData,
): Promise<SubscriptionRecord> {
    return createSubscriptionFn({ data })
}

/** Client wrapper for updating a subscription. */
export async function updateSubscription(
    id: string,
    data: SubscriptionFormData,
): Promise<SubscriptionRecord> {
    return updateSubscriptionFn({ data: { id, payload: data } })
}

/** Client wrapper for deleting a subscription. */
export async function deleteSubscription(id: string): Promise<void> {
    await deleteSubscriptionFn({ data: id })
}

/** Client wrapper for deleting several subscriptions. */
export async function deleteSubscriptions(ids: string[]): Promise<void> {
    await deleteSubscriptionsFn({ data: ids })
}

/** Client wrapper for the feature catalog query. */
export async function fetchFeatures(): Promise<FeatureRecord[]> {
    return getFeaturesFn()
}

/** Client wrapper for a subscription's assigned features query. */
export async function fetchSubscriptionFeatures(id: string): Promise<FeatureRecord[]> {
    return getSubscriptionFeaturesFn({ data: id })
}

/** Client wrapper for attaching features to a subscription. */
export async function attachFeatures(
    id: string,
    featureIds: string[],
): Promise<void> {
    await attachSubscriptionFeaturesFn({ data: { id, feature_ids: featureIds } })
}

/** Client wrapper for replacing a subscription's features. */
export async function syncFeatures(
    id: string,
    featureIds: string[],
): Promise<void> {
    await syncSubscriptionFeaturesFn({ data: { id, feature_ids: featureIds } })
}

/** Client wrapper for creating a catalog feature. */
export async function createFeature(payload: FeatureFormData): Promise<void> {
    await createFeatureFn({ data: payload })
}

/** Client wrapper for updating a catalog feature. */
export async function updateFeature(
    id: string,
    payload: FeatureFormData,
): Promise<void> {
    await updateFeatureFn({ data: { id, payload } })
}

/** Client wrapper for deleting a catalog feature. */
export async function deleteFeature(id: string): Promise<void> {
    await deleteFeatureFn({ data: id })
}
