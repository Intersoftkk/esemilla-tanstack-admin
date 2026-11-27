// #/features/payments/service/payments.service.ts
import type { PaginatedResponse } from '#/types'

import type { PaymentFormData } from '#/features/payments/schema/payments-form.schema.ts'
import type { PaymentsListParams } from '#/features/payments/schema/payments-search.schema.ts'
import type { PaymentRecord } from '#/features/payments/types/payments.ts'
import {
    createPaymentFn,
    deletePaymentFn,
    deletePaymentsFn,
    getCompaniesFn,
    getPaymentsFn,
    updatePaymentFn,
} from '#/features/payments/server/payments.functions.ts'

/** Client-side wrappers around the server functions for the payments feature. */
export async function fetchPaginatedPayments(
    params: PaymentsListParams,
): Promise<PaginatedResponse<PaymentRecord>> {
    return getPaymentsFn({ data: params })
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
    Awaited<ReturnType<typeof getCompaniesFn>>
> {
    return getCompaniesFn()
}

/** Client wrapper for creating a payment. */
export async function createPayment(
    data: PaymentFormData,
): Promise<PaymentRecord> {
    return createPaymentFn({ data })
}

/** Client wrapper for updating a payment. */
export async function updatePayment(
    id: string,
    data: PaymentFormData,
): Promise<PaymentRecord> {
    return updatePaymentFn({ data: { id, payload: data } })
}

/** Client wrapper for deleting a payment. */
export async function deletePayment(id: string): Promise<void> {
    await deletePaymentFn({ data: id })
}

/** Client wrapper for deleting several payments. */
export async function deletePayments(ids: string[]): Promise<void> {
    await deletePaymentsFn({ data: ids })
}
