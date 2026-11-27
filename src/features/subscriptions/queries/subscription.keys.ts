// #/features/subscriptions/queries/subscription.keys.ts

export const SUBSCRIPTION_KEYS = {
	all: ["subscriptions"] as const,
	/** Keys for paginated subscription lists. */
	lists: (params?: Record<string, unknown>) =>
		[...SUBSCRIPTION_KEYS.all, "lists", params ?? {}] as const,
	/** Key for a single (unpaginated) subscription list. */
	list: (params?: Record<string, unknown>) =>
		[...SUBSCRIPTION_KEYS.all, "list", params ?? {}] as const,
	/** Base key for subscription details. */
	details: () => [...SUBSCRIPTION_KEYS.all, "detail"] as const,
	/** Key for a single subscription detail. */
	detail: (id: string | number) =>
		[...SUBSCRIPTION_KEYS.details(), String(id)] as const,
	/** Key for the companies available to subscriptions. */
	companies: () => [...SUBSCRIPTION_KEYS.all, "companies"] as const,
	/** Key for the feature catalog. */
	features: () => [...SUBSCRIPTION_KEYS.all, "features"] as const,
	/** Key for the features assigned to a subscription. */
	subscriptionFeatures: (id: string | number) =>
		[...SUBSCRIPTION_KEYS.features(), String(id)] as const,
};
