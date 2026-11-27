// #/features/invoices/queries/invoice.keys.ts

export const INVOICE_KEYS = {
	all: ["invoices"] as const,
	/** Keys for paginated invoice lists. */
	lists: (params?: Record<string, unknown>) =>
		[...INVOICE_KEYS.all, "lists", params ?? {}] as const,
	/** Key for a single (unpaginated) invoice list. */
	list: (params?: Record<string, unknown>) =>
		[...INVOICE_KEYS.all, "list", params ?? {}] as const,
	/** Base key for invoice details. */
	details: () => [...INVOICE_KEYS.all, "detail"] as const,
	/** Key for a single invoice detail. */
	detail: (id: string | number) =>
		[...INVOICE_KEYS.details(), String(id)] as const,
	/** Key for the companies available to invoices. */
	companies: () => [...INVOICE_KEYS.all, "companies"] as const,
	/** Key for the feature catalog. */
	features: () => [...INVOICE_KEYS.all, "features"] as const,
	/** Key for the features assigned to an invoice. */
	invoiceFeatures: (id: string | number) =>
		[...INVOICE_KEYS.features(), String(id)] as const,
};
