// #/features/invoices/service/invoices.service.ts

import type { FeatureFormData } from "#/features/invoices/schema/features.schema.ts";

import type { InvoiceFormData } from "#/features/invoices/schema/invoices-form.schema.ts";
import type { InvoicesListParams } from "#/features/invoices/schema/invoices-search.schema.ts";
import {
	attachInvoiceFeaturesFn,
	createFeatureFn,
	createInvoiceFn,
	deleteFeatureFn,
	deleteInvoiceFn,
	deleteInvoicesFn,
	getCompaniesFn,
	getFeaturesFn,
	getInvoiceFeaturesFn,
	getInvoicesFn,
	syncInvoiceFeaturesFn,
	updateFeatureFn,
	updateInvoiceFn,
} from "#/features/invoices/server/invoices.functions.ts";
import type { FeatureRecord } from "#/features/invoices/types/features.type.ts";
import type { InvoiceRecord } from "#/features/invoices/types/invoices.type.ts";
import type { PaginatedResponse } from "#/types";

/** Client-side wrappers around the server functions for the invoices feature. */
export async function fetchPaginatedInvoices(
	params: InvoicesListParams,
): Promise<PaginatedResponse<InvoiceRecord>> {
	return getInvoicesFn({ data: params });
}

/** Client wrapper for the companies query. */
export async function fetchCompanies(): Promise<
	Awaited<ReturnType<typeof getCompaniesFn>>
> {
	return getCompaniesFn();
}

/** Client wrapper for creating an invoice. */
export async function createInvoice(
	data: InvoiceFormData,
): Promise<InvoiceRecord> {
	return createInvoiceFn({ data });
}

/** Client wrapper for updating an invoice. */
export async function updateInvoice(
	id: string,
	data: InvoiceFormData,
): Promise<InvoiceRecord> {
	return updateInvoiceFn({ data: { id, payload: data } });
}

/** Client wrapper for deleting an invoice. */
export async function deleteInvoice(id: string): Promise<void> {
	await deleteInvoiceFn({ data: id });
}

/** Client wrapper for deleting several invoices. */
export async function deleteInvoices(ids: string[]): Promise<void> {
	await deleteInvoicesFn({ data: ids });
}

/** Client wrapper for the feature catalog query. */
export async function fetchFeatures(): Promise<FeatureRecord[]> {
	return getFeaturesFn();
}

/** Client wrapper for an invoice's assigned features query. */
export async function fetchInvoiceFeatures(
	id: string,
): Promise<FeatureRecord[]> {
	return getInvoiceFeaturesFn({ data: id });
}

/** Client wrapper for attaching features to an invoice. */
export async function attachFeatures(
	id: string,
	featureIds: string[],
): Promise<void> {
	await attachInvoiceFeaturesFn({ data: { id, feature_ids: featureIds } });
}

/** Client wrapper for replacing an invoice's features. */
export async function syncFeatures(
	id: string,
	featureIds: string[],
): Promise<void> {
	await syncInvoiceFeaturesFn({ data: { id, feature_ids: featureIds } });
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
