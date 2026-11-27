// #/features/payments/queries/payment.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { PAYMENT_KEYS } from '#/features/payments/queries/payment.keys.ts'
import type { PaymentFormData } from '#/features/payments/schema/payments-form.schema.ts'
import type { PaymentsListParams } from '#/features/payments/schema/payments-search.schema.ts'
import {
    createPayment,
    deletePayment,
    deletePayments,
    fetchCompanies,
    fetchPaginatedPayments,
    updatePayment,
} from '#/features/payments/service/payments.service.ts'

interface PaymentMutationOptions {
    /** Called after the cache has been invalidated and the toast shown. */
    onSuccess?: () => void
}

/** Returns an error message suitable for a toast. */
function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback
}

/** Paginated payments list, keyed by the current table state. */
export function usePaymentsPaginateQuery(params: PaymentsListParams) {
    return useQuery({
        queryKey: PAYMENT_KEYS.lists(params),
        queryFn: () => fetchPaginatedPayments(params),
    })
}

/** Companies available for assignment when creating or editing a payment. */
export function useCompaniesQuery() {
    return useQuery({
        queryKey: PAYMENT_KEYS.companies(),
        queryFn: fetchCompanies,
        staleTime: 1000 * 60 * 5,
    })
}

/** Creates a payment. */
export function useCreatePaymentMutation(options?: PaymentMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: PaymentFormData) => createPayment(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all })
            toast.success('Payment created successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not create payment.')),
    })
}

/** Updates an existing payment. */
export function useUpdatePaymentMutation(options?: PaymentMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: PaymentFormData }) =>
            updatePayment(id, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all })
            toast.success('Payment updated successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not update payment.')),
    })
}

/** Deletes a single payment. */
export function useDeletePaymentMutation(options?: PaymentMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deletePayment(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all })
            toast.success('Payment deleted successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete payment.')),
    })
}

/** Deletes the selected payments in one batch. */
export function useDeletePaymentsMutation(options?: PaymentMutationOptions) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ids: string[]) => deletePayments(ids),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.all })
            toast.success('Selected payments deleted successfully.')
            options?.onSuccess?.()
        },
        onError: (error) =>
            toast.error(getErrorMessage(error, 'Could not delete payments.')),
    })
}
