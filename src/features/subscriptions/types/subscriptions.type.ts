// #/features/subscriptions/types/subscriptions.type.ts
import type { FeatureRecord } from "#/features/subscriptions/types/features.type.ts";

export type SubscriptionStatus = "draft" | "active" | "completed" | "archived";

export interface CompanyRecord {
	id: string | number;
	name?: string | null;
}

export interface SubscriptionRecord {
	id: string;
	company_id: string;
	company?: CompanyRecord | null;
	name: string;
	description?: string | null;
	start_date?: string | null;
	end_date?: string | null;
	status: SubscriptionStatus;
	features?: FeatureRecord[];
}

export interface CompanyOption {
	id: string | number;
	name?: string | null;
}
