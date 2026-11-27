// #/features/invoices/queries/invoice.queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { INVOICE_KEYS } from "#/features/invoices/queries/invoice.keys.ts";
import type { FeatureFormData } from "#/features/invoices/schema/features.schema.ts";
import type { InvoiceFormData } from "#/features/invoices/schema/invoices-form.schema.ts";
import type { InvoicesListParams } from "#/features/invoices/schema/invoices-search.schema.ts";
import {
	attachFeatures,
	createFeature,
	createInvoice,
	deleteFeature,
	deleteInvoice,
	deleteInvoices,
	fetchCompanies,
	fetchFeatures,
	fetchInvoiceFeatures,
	fetchPaginatedInvoices,
	syncFeatures,
	updateFeature,
	updateInvoice,
} from "#/features/invoices/service/invoices.service.ts";

interface InvoiceMutationOptions {
	/** Called after the cache has been invalidated and the toast shown. */
	onSuccess?: () => void;
}

/** Returns an error message suitable for a toast. */
function getErrorMessage(error: unknown, fallback: string): string {
	return error instanceof Error && error.message ? error.message : fallback;
}

/** Paginated invoices list, keyed by the current table state. */
export function useInvoicesPaginateQuery(params: InvoicesListParams) {
	return useQuery({
		queryKey: INVOICE_KEYS.lists(params),
		queryFn: () => fetchPaginatedInvoices(params),
	});
}

/** Companies available for assignment when creating or editing an invoice. */
export function useCompaniesQuery() {
	return useQuery({
		queryKey: INVOICE_KEYS.companies(),
		queryFn: fetchCompanies,
		staleTime: 1000 * 60 * 5,
	});
}

/** Creates an invoice. */
export function useCreateInvoiceMutation(options?: InvoiceMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: InvoiceFormData) => createInvoice(payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all });
			toast.success("Invoice created successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not create invoice.")),
	});
}

/** Updates an existing invoice. */
export function useUpdateInvoiceMutation(options?: InvoiceMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: InvoiceFormData }) =>
			updateInvoice(id, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all });
			toast.success("Invoice updated successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not update invoice.")),
	});
}

/** Deletes a single invoice. */
export function useDeleteInvoiceMutation(options?: InvoiceMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteInvoice(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all });
			toast.success("Invoice deleted successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete invoice.")),
	});
}

/** Deletes the selected invoices in one batch. */
export function useDeleteInvoicesMutation(options?: InvoiceMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => deleteInvoices(ids),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all });
			toast.success("Selected invoices deleted successfully.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete invoices.")),
	});
}

/** Feature catalog available to invoices. */
export function useFeaturesQuery(enabled = true) {
	return useQuery({
		queryKey: INVOICE_KEYS.features(),
		queryFn: fetchFeatures,
		enabled,
		staleTime: 1000 * 60 * 5,
	});
}

/** Features already assigned to an invoice. */
export function useInvoiceFeaturesQuery(invoiceId?: string, enabled = true) {
	return useQuery({
		queryKey: INVOICE_KEYS.invoiceFeatures(invoiceId ?? ""),
		queryFn: () => fetchInvoiceFeatures(invoiceId as string),
		enabled: enabled && Boolean(invoiceId),
	});
}

/** Attaches selected features to an invoice without removing existing ones. */
export function useAttachInvoiceFeaturesMutation(
	options?: InvoiceMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, featureIds }: { id: string; featureIds: string[] }) =>
			attachFeatures(id, featureIds),
		onSuccess: async (_result, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all }),
				queryClient.invalidateQueries({
					queryKey: INVOICE_KEYS.invoiceFeatures(variables.id),
				}),
			]);
			toast.success("Features attached to the invoice.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not attach features.")),
	});
}

/** Replaces an invoice's features with the selected list. */
export function useSyncInvoiceFeaturesMutation(
	options?: InvoiceMutationOptions,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, featureIds }: { id: string; featureIds: string[] }) =>
			syncFeatures(id, featureIds),
		onSuccess: async (_result, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all }),
				queryClient.invalidateQueries({
					queryKey: INVOICE_KEYS.invoiceFeatures(variables.id),
				}),
			]);
			toast.success("Invoice features synchronized.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not sync features.")),
	});
}

/** Creates a feature in the catalog. */
export function useCreateFeatureMutation(options?: InvoiceMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: FeatureFormData) => createFeature(payload),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: INVOICE_KEYS.features(),
				}),
				queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all }),
			]);
			toast.success("Feature created.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not create feature.")),
	});
}

/** Updates a feature in the catalog. */
export function useUpdateFeatureMutation(options?: InvoiceMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: FeatureFormData }) =>
			updateFeature(id, payload),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: INVOICE_KEYS.features(),
				}),
				queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all }),
			]);
			toast.success("Feature updated.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not update feature.")),
	});
}

/** Deletes a feature from the catalog. */
export function useDeleteFeatureMutation(options?: InvoiceMutationOptions) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteFeature(id),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: INVOICE_KEYS.features(),
				}),
				queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all }),
			]);
			toast.success("Feature deleted.");
			options?.onSuccess?.();
		},
		onError: (error) =>
			toast.error(getErrorMessage(error, "Could not delete feature.")),
	});
}
