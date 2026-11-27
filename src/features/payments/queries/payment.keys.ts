// #/features/payments/queries/payment.keys.ts

export const PAYMENT_KEYS = {
	all: ["payments"] as const,
	/** Keys for paginated payment lists. */
	lists: (params?: Record<string, unknown>) =>
		[...PAYMENT_KEYS.all, "lists", params ?? {}] as const,
	/** Key for a single (unpaginated) payment list. */
	list: (params?: Record<string, unknown>) =>
		[...PAYMENT_KEYS.all, "list", params ?? {}] as const,
	/** Base key for payment details. */
	details: () => [...PAYMENT_KEYS.all, "detail"] as const,
	/** Key for a single payment detail. */
	detail: (id: string | number) =>
		[...PAYMENT_KEYS.details(), String(id)] as const,
	/** Key for the companies available to payments. */
	companies: () => [...PAYMENT_KEYS.all, "companies"] as const,
};
