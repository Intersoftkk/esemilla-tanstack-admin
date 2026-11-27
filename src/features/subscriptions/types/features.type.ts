// #/features/subscriptions/types/features.type.ts

/** A feature that can be attached to a subscription via the Laravel `features` resource. */
export interface FeatureRecord {
	id: string;
	name: string;
	code?: string | null;
	description?: string | null;
}
