// #/features/support/queries/support.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { SUPPORT_KEYS } from '#/features/support/queries/support.keys.ts'
import type { SupportFormData } from '#/features/support/schema/support-form.schema.ts'
import type { SupportListParams } from '#/features/support/schema/support-search.schema.ts'
import {
    createSupport,
    deleteSupport,
    deleteSupports,
    fetchCompanies,
    fetchPaginatedSupport,
    updateSupport,
} from '#/features/support/service/support.service.ts'

interface SupportMutationOptions {
    /** Called after the cache has been invalidated and the toast shown. */
    onSuccess?: () => void
}

/** Returns an error message suitable for a toast. */
function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback
}

/** Paginated support list, keyed by the current table state. */
export function useSupportPaginateQuery(params: SupportListParams) {
    return useQuery({
        queryKey: SUPPORT_KEYS.lists(params),
        queryFn: () => fetchPaginatedSupport(params),
    })
}

/** Companies available for assignment when creating or editing a support. */
export function useCompaniesQuery() {
    return useQuery({
        queryKey: SUPPORT_KEYS.companies(),
        queryFn: fetchCompanies,
        staleTime: 1000 * 60 * 5,
    })
}

/** Creates a support. */
export function useCreateSupportMutation(options?: SupportMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: SupportFormData) => createSupport(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.all })
            toast.success('Support created successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not create support.')),
    })
}

/** Updates an existing support. */
export function useUpdateSupportMutation(options?: SupportMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: SupportFormData }) =>
            updateSupport(id, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.all })
            toast.success('Support updated successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not update support.')),
    })
}

/** Deletes a single support. */
export function useDeleteSupportMutation(options?: SupportMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteSupport(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.all })
            toast.success('Support deleted successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete support.')),
    })
}

/** Deletes the selected support in one batch. */
export function useDeleteSupportsMutation(options?: SupportMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => deleteSupports(ids),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: SUPPORT_KEYS.all })
            toast.success('Selected support deleted successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete support.')),
    })
}
