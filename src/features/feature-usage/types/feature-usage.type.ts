// #/features/feature-usage/types/feature-usage.type.ts

export interface FeatureUsageRef {
	id: string;
	name: string | null;
}

export interface FeatureUsageRecord {
	id: string;
	tenant: FeatureUsageRef | null;
	feature: FeatureUsageRef | null;
	/** Units consumed in the current period. */
	used: number;
	/** `null` means the plan leaves this feature unlimited. */
	limit: number | null;
	/** Billing period the counter belongs to, e.g. `2026-11`. */
	period: string | null;
	resetsAt: string | null;
	updatedAt: string | null;
}
