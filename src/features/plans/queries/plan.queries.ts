// #/features/plans/queries/plan.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { PLAN_KEYS } from '#/features/plans/queries/plan.keys.ts'
import type { FeatureFormData } from '#/features/plans/schema/features.schema.ts'
import type { PlanFormData } from '#/features/plans/schema/plans-form.schema.ts'
import type { PlansListParams } from '#/features/plans/schema/plans-search.schema.ts'
import {
    attachFeatures,
    createFeature,
    createPlan,
    deleteFeature,
    deletePlan,
    deletePlans,
    fetchCompanies,
    fetchFeatures,
    fetchPaginatedPlans,
    fetchPlanFeatures,
    syncFeatures,
    updateFeature,
    updatePlan,
} from '#/features/plans/service/plans.service.ts'

interface PlanMutationOptions {
    /** Called after the cache has been invalidated and the toast shown. */
    onSuccess?: () => void
}

/** Returns an error message suitable for a toast. */
function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback
}

/** Paginated plans list, keyed by the current table state. */
export function usePlansPaginateQuery(params: PlansListParams) {
    return useQuery({
        queryKey: PLAN_KEYS.lists(params),
        queryFn: () => fetchPaginatedPlans(params),
    })
}

/** Companies available for assignment when creating or editing a plan. */
export function useCompaniesQuery() {
    return useQuery({
        queryKey: PLAN_KEYS.companies(),
        queryFn: fetchCompanies,
        staleTime: 1000 * 60 * 5,
    })
}

/** Creates a plan. */
export function useCreatePlanMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: PlanFormData) => createPlan(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all })
            toast.success('Plan created successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not create plan.')),
    })
}

/** Updates an existing plan. */
export function useUpdatePlanMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: PlanFormData }) =>
            updatePlan(id, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all })
            toast.success('Plan updated successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not update plan.')),
    })
}

/** Deletes a single plan. */
export function useDeletePlanMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deletePlan(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all })
            toast.success('Plan deleted successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete plan.')),
    })
}

/** Deletes the selected plans in one batch. */
export function useDeletePlansMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => deletePlans(ids),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all })
            toast.success('Selected plans deleted successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete plans.')),
    })
}


/** Feature catalog available to plans. */
export function useFeaturesQuery(enabled = true) {
    return useQuery({
        queryKey: PLAN_KEYS.features(),
        queryFn: fetchFeatures,
        enabled,
        staleTime: 1000 * 60 * 5,
    })
}

/** Features already assigned to a plan. */
export function usePlanFeaturesQuery(planId?: string, enabled = true) {
    return useQuery({
        queryKey: PLAN_KEYS.planFeatures(planId ?? ''),
        queryFn: () => fetchPlanFeatures(planId as string),
        enabled: enabled && Boolean(planId),
    })
}

/** Attaches selected features to a plan without removing existing ones. */
export function useAttachPlanFeaturesMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            featureIds,
        }: {
            id: string
            featureIds: string[]
        }) => attachFeatures(id, featureIds),
        onSuccess: async (_result, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all }),
                queryClient.invalidateQueries({
                    queryKey: PLAN_KEYS.planFeatures(variables.id),
                }),
            ])
            toast.success('Features attached to the plan.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not attach features.')),
    })
}

/** Replaces a plan's features with the selected list. */
export function useSyncPlanFeaturesMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            featureIds,
        }: {
            id: string
            featureIds: string[]
        }) => syncFeatures(id, featureIds),
        onSuccess: async (_result, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all }),
                queryClient.invalidateQueries({
                    queryKey: PLAN_KEYS.planFeatures(variables.id),
                }),
            ])
            toast.success('Plan features synchronized.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not sync features.')),
    })
}


/** Creates a feature in the catalog. */
export function useCreateFeatureMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: FeatureFormData) => createFeature(payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: PLAN_KEYS.features(),
                }),
                queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all }),
            ])
            toast.success('Feature created.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not create feature.')),
    })
}

/** Updates a feature in the catalog. */
export function useUpdateFeatureMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: FeatureFormData }) =>
            updateFeature(id, payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: PLAN_KEYS.features(),
                }),
                queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all }),
            ])
            toast.success('Feature updated.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not update feature.')),
    })
}

/** Deletes a feature from the catalog. */
export function useDeleteFeatureMutation(options?: PlanMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteFeature(id),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: PLAN_KEYS.features(),
                }),
                queryClient.invalidateQueries({ queryKey: PLAN_KEYS.all }),
            ])
            toast.success('Feature deleted.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete feature.')),
    })
}
