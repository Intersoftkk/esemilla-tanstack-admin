// #/features/plans/service/plans.service.ts
import type { PaginatedResponse } from '#/types'

import type { PlanFormData } from '#/features/plans/schema/plans-form.schema.ts'
import type {
    PlansListParams,
} from '#/features/plans/schema/plans-search.schema.ts'
import type { PlanRecord } from '#/features/plans/types/plans.ts'
import {
    createPlanFn,
    deletePlanFn,
    getCompaniesFn,
    getPlansFn,
    updatePlanFn,
} from '#/features/plans/server/plans.functions.ts'

/** Client-side wrappers around the server functions for the plans feature. */
export async function fetchPaginatedPlans(
    params: PlansListParams,
): Promise<PaginatedResponse<PlanRecord>> {
    return getPlansFn({ data: params })
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
    Awaited<ReturnType<typeof getCompaniesFn>>
> {
    return getCompaniesFn()
}

/** Client wrapper for creating a plan. */
export async function createPlan(
    data: PlanFormData,
): Promise<PlanRecord> {
    return createPlanFn({ data })
}

/** Client wrapper for updating a plan. */
export async function updatePlan(
    id: string,
    data: PlanFormData,
): Promise<PlanRecord> {
    return updatePlanFn({ data: { id, payload: data } })
}

/** Client wrapper for deleting a plan. */
export async function deletePlan(id: string): Promise<void> {
    await deletePlanFn({ data: id })
}
