// #/features/support/service/support.service.ts
import type { PaginatedResponse } from '#/types'

import type { SupportFormData } from '#/features/support/schema/support-form.schema.ts'
import type { SupportListParams } from '#/features/support/schema/support-search.schema.ts'
import type { SupportRecord } from '#/features/support/types/support.type.ts'
import {
    createSupportFn,
    deleteSupportFn,
    deleteSupportsFn,
    getCompaniesFn,
    getSupportListFn,
    updateSupportFn,
} from '#/features/support/server/support.functions.ts'

/** Client-side wrappers around the server functions for the support feature. */
export async function fetchPaginatedSupport(
    params: SupportListParams,
): Promise<PaginatedResponse<SupportRecord>> {
    return getSupportListFn({ data: params })
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
    Awaited<ReturnType<typeof getCompaniesFn>>
> {
    return getCompaniesFn()
}

/** Client wrapper for creating a support. */
export async function createSupport(
    data: SupportFormData,
): Promise<SupportRecord> {
    return createSupportFn({ data })
}

/** Client wrapper for updating a support. */
export async function updateSupport(
    id: string,
    data: SupportFormData,
): Promise<SupportRecord> {
    return updateSupportFn({ data: { id, payload: data } })
}

/** Client wrapper for deleting a support. */
export async function deleteSupport(id: string): Promise<void> {
    await deleteSupportFn({ data: id })
}

/** Client wrapper for deleting several support. */
export async function deleteSupports(ids: string[]): Promise<void> {
    await deleteSupportsFn({ data: ids })
}
