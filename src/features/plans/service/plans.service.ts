// #/features/plans/service/plans.service.ts

import type { FeatureFormData } from "#/features/plans/schema/features.schema.ts";

import type { PlanFormData } from "#/features/plans/schema/plans-form.schema.ts";
import type { PlansListParams } from "#/features/plans/schema/plans-search.schema.ts";
import {
	attachPlanFeaturesFn,
	createFeatureFn,
	createPlanFn,
	deleteFeatureFn,
	deletePlanFn,
	deletePlansFn,
	getCompaniesFn,
	getFeaturesFn,
	getPlanFeaturesFn,
	getPlansFn,
	syncPlanFeaturesFn,
	updateFeatureFn,
	updatePlanFn,
} from "#/features/plans/server/plans.functions.ts";
import type { FeatureRecord } from "#/features/plans/types/features.type.ts";
import type { PlanRecord } from "#/features/plans/types/plans.type.ts";
import type { PaginatedResponse } from "#/types";

/** Client-side wrappers around the server functions for the plans feature. */
export async function fetchPaginatedPlans(
	params: PlansListParams,
): Promise<PaginatedResponse<PlanRecord>> {
	return getPlansFn({ data: params });
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
	Awaited<ReturnType<typeof getCompaniesFn>>
> {
	return getCompaniesFn();
}

/** Client wrapper for creating a plan. */
export async function createPlan(data: PlanFormData): Promise<PlanRecord> {
	return createPlanFn({ data });
}

/** Client wrapper for updating a plan. */
export async function updatePlan(
	id: string,
	data: PlanFormData,
): Promise<PlanRecord> {
	return updatePlanFn({ data: { id, payload: data } });
}

/** Client wrapper for deleting a plan. */
export async function deletePlan(id: string): Promise<void> {
	await deletePlanFn({ data: id });
}

/** Client wrapper for deleting several plans. */
export async function deletePlans(ids: string[]): Promise<void> {
	await deletePlansFn({ data: ids });
}

/** Client wrapper for the feature catalog query. */
export async function fetchFeatures(): Promise<FeatureRecord[]> {
	return getFeaturesFn();
}

/** Client wrapper for a plan's assigned features query. */
export async function fetchPlanFeatures(id: string): Promise<FeatureRecord[]> {
	return getPlanFeaturesFn({ data: id });
}

/** Client wrapper for attaching features to a plan. */
export async function attachFeatures(
	id: string,
	featureIds: string[],
): Promise<void> {
	await attachPlanFeaturesFn({ data: { id, feature_ids: featureIds } });
}

/** Client wrapper for replacing a plan's features. */
export async function syncFeatures(
	id: string,
	featureIds: string[],
): Promise<void> {
	await syncPlanFeaturesFn({ data: { id, feature_ids: featureIds } });
}

/** Client wrapper for creating a catalog feature. */
export async function createFeature(payload: FeatureFormData): Promise<void> {
	await createFeatureFn({ data: payload });
}

/** Client wrapper for updating a catalog feature. */
export async function updateFeature(
	id: string,
	payload: FeatureFormData,
): Promise<void> {
	await updateFeatureFn({ data: { id, payload } });
}

/** Client wrapper for deleting a catalog feature. */
export async function deleteFeature(id: string): Promise<void> {
	await deleteFeatureFn({ data: id });
}
