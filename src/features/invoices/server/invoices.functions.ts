// #/features/invoices/server/invoices.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import {
    featureSchema,
    invoiceFeaturesSchema,
} from '#/features/invoices/schema/features.schema.ts'
import { invoiceSchema } from '#/features/invoices/schema/invoices-form.schema.ts'
import {
    invoicesListParamsSchema,
} from '#/features/invoices/schema/invoices-search.schema.ts'
import {
    attachInvoiceFeatures,
    createFeatureRequest,
    createInvoiceRequest,
    deleteFeatureRequest,
    deleteInvoiceRequest,
    fetchCompanies,
    fetchFeatures,
    fetchInvoice,
    fetchInvoiceFeatures,
    fetchInvoices,
    syncInvoiceFeatures,
    updateFeatureRequest,
    updateInvoiceRequest,
} from '#/features/invoices/server/invoices.server.ts'

const invoiceIdSchema = z.union([z.string(), z.number()]).transform(String)

const updateInvoiceSchema = z.object({
    id: invoiceIdSchema,
    payload: invoiceSchema,
})

/** Server function: paginated invoices list. */
export const getInvoicesFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => invoicesListParamsSchema.parse(data ?? {}))
    .handler(async ({ data }) => fetchInvoices(data))

/** Server function: a single invoice by ID. */
export const getInvoiceFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => invoiceIdSchema.parse(data))
    .handler(async ({ data: id }) => fetchInvoice(id))

/** Server function: companies available for invoice assignment. */
export const getCompaniesFn = createServerFn({ method: 'GET' }).handler(
    async () => fetchCompanies(),
)

/** Server function: create an invoice. */
export const createInvoiceFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => invoiceSchema.parse(data))
    .handler(async ({ data }) => createInvoiceRequest(data))

/** Server function: update an invoice. */
export const updateInvoiceFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => updateInvoiceSchema.parse(data))
    .handler(async ({ data }) => updateInvoiceRequest(data.id, data.payload))

/** Server function: delete an invoice. */
export const deleteInvoiceFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => invoiceIdSchema.parse(data))
    .handler(async ({ data: id }) => deleteInvoiceRequest(id))

/** Server function: delete several invoices in one request. */
export const deleteInvoicesFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) =>
        z.array(invoiceIdSchema).min(1).parse(data),
    )
    .handler(async ({ data: ids }) => {
        await Promise.all(ids.map((id) => deleteInvoiceRequest(id)))
        return { deleted: ids.length }
    })


/** Server function: feature catalog. */
export const getFeaturesFn = createServerFn({ method: 'GET' }).handler(
    async () => fetchFeatures(),
)

/** Server function: features assigned to an invoice. */
export const getInvoiceFeaturesFn = createServerFn({ method: 'GET' })
    .validator((data: unknown) => invoiceIdSchema.parse(data))
    .handler(async ({ data: id }) => fetchInvoiceFeatures(id))

const invoiceFeaturesInputSchema = z.object({
    id: invoiceIdSchema,
    feature_ids: invoiceFeaturesSchema.shape.feature_ids,
})

/** Server function: attach features to an invoice. */
export const attachInvoiceFeaturesFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => invoiceFeaturesInputSchema.parse(data))
    .handler(async ({ data }) => attachInvoiceFeatures(data.id, data.feature_ids))

/** Server function: replace an invoice's features. */
export const syncInvoiceFeaturesFn = createServerFn({ method: 'POST' })
    .validator((data: unknown) => invoiceFeaturesInputSchema.parse(data))
    .handler(async ({ data }) => syncInvoiceFeatures(data.id, data.feature_ids))


const updateFeatureSchema = z.object({
    id: invoiceIdSchema,
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
    .validator((data: unknown) => invoiceIdSchema.parse(data))
    .handler(async ({ data: id }) => deleteFeatureRequest(id))
