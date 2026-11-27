// #/features/subscriptions/server/subscriptions.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import {
    featureSchema,
    subscriptionFeaturesSchema,
} from '#/features/subscriptions/schema/features.schema.ts'
import { subscriptionSchema } from '#/features/subscriptions/schema/subscriptions-form.schema.ts'
import {
    subscriptionsListParamsSchema,
} from '#/features/subscriptions/schema/subscriptions-search.schema.ts'
import {
    attachSubscriptionFeatures,
    createFeatureRequest,
    createSubscriptionRequest,
    deleteFeatureRequest,
    deleteSubscriptionRequest,
    fetchCompanies,
    fetchFeatures,
    fetchSubscription,
    fetchSubscriptionFeatures,
    fetchSubscriptions,
    syncSubscriptionFeatures,
    updateFeatureRequest,
    updateSubscriptionRequest,
} from '#/features/subscriptions/server/subscriptions.server.ts'

const subscriptionIdSchema = z.union([z.string(), z.number()]).transform(String)

const updateSubscriptionSchema = z.object({
    id: subscriptionIdSchema,
    payload: subscriptionSchema,
})

/** Server function: paginated subscriptions list. */
export const getSubscriptionsFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => subscriptionsListParamsSchema.parse(data ?? {}))
    .handler(async ({ data }) => fetchSubscriptions(data))

/** Server function: a single subscription by ID. */
export const getSubscriptionFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => subscriptionIdSchema.parse(data))
    .handler(async ({ data: id }) => fetchSubscription(id))

/** Server function: companies available for subscription assignment. */
export const getCompaniesFn = createServerFn({ method: 'GET' }).handler(
    async () => fetchCompanies(),
)

/** Server function: create a subscription. */
export const createSubscriptionFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => subscriptionSchema.parse(data))
    .handler(async ({ data }) => createSubscriptionRequest(data))

/** Server function: update a subscription. */
export const updateSubscriptionFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => updateSubscriptionSchema.parse(data))
    .handler(async ({ data }) => updateSubscriptionRequest(data.id, data.payload))

/** Server function: delete a subscription. */
export const deleteSubscriptionFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => subscriptionIdSchema.parse(data))
    .handler(async ({ data: id }) => deleteSubscriptionRequest(id))

/** Server function: delete several subscriptions in one request. */
export const deleteSubscriptionsFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) =>
        z.array(subscriptionIdSchema).min(1).parse(data),
    )
    .handler(async ({ data: ids }) => {
        await Promise.all(ids.map((id) => deleteSubscriptionRequest(id)))
        return { deleted: ids.length }
    })


/** Server function: feature catalog. */
export const getFeaturesFn = createServerFn({ method: 'GET' }).handler(
    async () => fetchFeatures(),
)

/** Server function: features assigned to a subscription. */
export const getSubscriptionFeaturesFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => subscriptionIdSchema.parse(data))
    .handler(async ({ data: id }) => fetchSubscriptionFeatures(id))

const subscriptionFeaturesInputSchema = z.object({
    id: subscriptionIdSchema,
    feature_ids: subscriptionFeaturesSchema.shape.feature_ids,
})

/** Server function: attach features to a subscription. */
export const attachSubscriptionFeaturesFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => subscriptionFeaturesInputSchema.parse(data))
    .handler(async ({ data }) => attachSubscriptionFeatures(data.id, data.feature_ids))

/** Server function: replace a subscription's features. */
export const syncSubscriptionFeaturesFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => subscriptionFeaturesInputSchema.parse(data))
    .handler(async ({ data }) => syncSubscriptionFeatures(data.id, data.feature_ids))


const updateFeatureSchema = z.object({
    id: subscriptionIdSchema,
    payload: featureSchema,
})

/** Server function: create a catalog feature. */
export const createFeatureFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => featureSchema.parse(data))
    .handler(async ({ data }) => createFeatureRequest(data))

/** Server function: update a catalog feature. */
export const updateFeatureFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => updateFeatureSchema.parse(data))
    .handler(async ({ data }) =>
        updateFeatureRequest(data.id, data.payload),
    )

/** Server function: delete a catalog feature. */
export const deleteFeatureFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => subscriptionIdSchema.parse(data))
    .handler(async ({ data: id }) => deleteFeatureRequest(id))
