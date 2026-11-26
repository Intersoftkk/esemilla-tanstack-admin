// #/features/plans/server/plans.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { planFeaturesSchema } from '#/features/plans/schema/features.schema.ts'
import { planSchema } from '#/features/plans/schema/plans-form.schema.ts'
import {
    plansListParamsSchema,
} from '#/features/plans/schema/plans-search.schema.ts'
import {
    attachPlanFeatures,
    createPlanRequest,
    deletePlanRequest,
    fetchCompanies,
    fetchFeatures,
    fetchPlan,
    fetchPlanFeatures,
    fetchPlans,
    syncPlanFeatures,
    updatePlanRequest,
} from '#/features/plans/server/plans.server.ts'

const planIdSchema = z.union([z.string(), z.number()]).transform(String)

const updatePlanSchema = z.object({
    id: planIdSchema,
    payload: planSchema,
})

/** Server function: paginated plans list. */
export const getPlansFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => plansListParamsSchema.parse(data ?? {}))
    .handler(async ({ data }) => fetchPlans(data))

/** Server function: a single plan by ID. */
export const getPlanFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => planIdSchema.parse(data))
    .handler(async ({ data: id }) => fetchPlan(id))

/** Server function: companies available for plan assignment. */
export const getCompaniesFn = createServerFn({ method: 'GET' }).handler(
    async () => fetchCompanies(),
)

/** Server function: create a plan. */
export const createPlanFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => planSchema.parse(data))
    .handler(async ({ data }) => createPlanRequest(data))

/** Server function: update a plan. */
export const updatePlanFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => updatePlanSchema.parse(data))
    .handler(async ({ data }) => updatePlanRequest(data.id, data.payload))

/** Server function: delete a plan. */
export const deletePlanFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => planIdSchema.parse(data))
    .handler(async ({ data: id }) => deletePlanRequest(id))

/** Server function: delete several plans in one request. */
export const deletePlansFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) =>
        z.array(planIdSchema).min(1).parse(data),
    )
    .handler(async ({ data: ids }) => {
        await Promise.all(ids.map((id) => deletePlanRequest(id)))
        return { deleted: ids.length }
    })


/** Server function: feature catalog. */
export const getFeaturesFn = createServerFn({ method: 'GET' }).handler(
    async () => fetchFeatures(),
)

/** Server function: features assigned to a plan. */
export const getPlanFeaturesFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => planIdSchema.parse(data))
    .handler(async ({ data: id }) => fetchPlanFeatures(id))

const planFeaturesInputSchema = z.object({
    id: planIdSchema,
    feature_ids: planFeaturesSchema.shape.feature_ids,
})

/** Server function: attach features to a plan. */
export const attachPlanFeaturesFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => planFeaturesInputSchema.parse(data))
    .handler(async ({ data }) => attachPlanFeatures(data.id, data.feature_ids))

/** Server function: replace a plan's features. */
export const syncPlanFeaturesFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => planFeaturesInputSchema.parse(data))
    .handler(async ({ data }) => syncPlanFeatures(data.id, data.feature_ids))
