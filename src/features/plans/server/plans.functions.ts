// #/features/plans/server/plans.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { planSchema } from '#/features/plans/schema/plans-form.schema.ts'
import {
    plansListParamsSchema,
} from '#/features/plans/schema/plans-search.schema.ts'
import {
    createPlanRequest,
    deletePlanRequest,
    fetchCompanies,
    fetchPlan,
    fetchPlans,
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
