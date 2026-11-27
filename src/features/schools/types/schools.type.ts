// #/features/schools/types/schools.type.ts

/**
 * Lifecycle of a business workspace.
 * `pending`   – onboarding submitted, waiting for verification before go-live
 * `active`    – portal is live and billing is running
 * `suspended` – access blocked (payment issue or manual hold), data is kept
 * `archived`  – read-only, hidden from the team
 */
export const SCHOOL_STATUSES = [
	"pending",
	"active",
	"suspended",
	"archived",
] as const;

export type SchoolStatus = (typeof SCHOOL_STATUSES)[number];

/** The kind of institution the workspace represents. */
export const SCHOOL_TYPES = [
	"school",
	"college",
	"university",
	"kindergarten",
	"training-center",
	"coaching",
	"other",
] as const;

export type SchoolType = (typeof SCHOOL_TYPES)[number];

export const BILLING_CYCLES = ["monthly", "yearly"] as const;

export type BillingCycle = (typeof BILLING_CYCLES)[number];

export interface PlanLimits {
	students: number;
	staff: number;
	branches: number;
	storageGb: number;
	customDomains: number;
}

export interface PlanPrice {
	monthly: number;
	yearly: number;
}

/** A subscription plan that a school can be onboarded onto. */
export interface Plan {
	id: string;
	slug: string;
	name: string;
	tagline: string;
	price: PlanPrice;
	currency: string;
	trialDays: number;
	popular?: boolean;
	limits: PlanLimits;
	features: string[];
}

export interface SchoolAddress {
	line1: string;
	line2: string | null;
	city: string;
	state: string | null;
	postalCode: string | null;
	/** ISO-3166-1 alpha-2 country code. */
	country: string;
	/** IANA timezone, e.g. `Asia/Kolkata`. */
	timezone: string;
}

export interface SchoolContact {
	name: string;
	email: string;
	phone: string | null;
}

/** Live consumption of a school's plan limits. */
export interface SchoolUsage {
	students: number;
	staff: number;
	branches: number;
	storageGb: number;
}

export interface School {
	id: string;
	name: string;
	slug: string;
	/** Subdomain part of the hosted portal, e.g. `oakridge`. */
	subdomain: string;
	customDomain: string | null;
	customDomainVerified: boolean;
	type: SchoolType;
	status: SchoolStatus;
	plan: Plan | null;
	planId: string | null;
	billingCycle: BillingCycle;
	description: string | null;
	website: string | null;
	email: string;
	phone: string | null;
	currency: string;
	logoUrl: string | null;
	address: SchoolAddress;
	contact: SchoolContact | null;
	usage: SchoolUsage;
	trialEndsAt: string | null;
	createdAt: string;
	updatedAt: string | null;
}

export interface SchoolListFilters {
	search?: string;
	status?: SchoolStatus;
}

/** Payload sent to `POST /schools` when a user onboards their business. */
export interface OnboardSchoolPayload {
	name: string;
	type: SchoolType;
	email: string;
	phone: string | null;
	website: string | null;
	description: string | null;
	slug: string;
	customDomain: string | null;
	currency: string;
	planId: string;
	billingCycle: BillingCycle;
	expectedStudents: number;
	expectedBranches: number;
	address: {
		line1: string;
		line2: string | null;
		city: string;
		state: string | null;
		postalCode: string | null;
		country: string;
		timezone: string;
	};
	admin: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string | null;
	};
	acceptTerms: boolean;
}

/** Payload accepted by `PUT /schools/{id}` — every field is optional. */
export interface UpdateSchoolPayload {
	name?: string;
	type?: SchoolType;
	email?: string;
	phone?: string | null;
	website?: string | null;
	description?: string | null;
	slug?: string;
	customDomain?: string | null;
	currency?: string;
	planId?: string;
	billingCycle?: BillingCycle;
	address?: OnboardSchoolPayload["address"];
}

export interface SlugAvailability {
	available: boolean;
	suggestions: string[];
}

export interface SchoolStats {
	total: number;
	active: number;
	pending: number;
	suspended: number;
	students: number;
	staff: number;
	branches: number;
	customDomains: number;
}
