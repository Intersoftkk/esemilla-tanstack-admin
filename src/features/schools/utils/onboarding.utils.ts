import {
	DEFAULT_COUNTRY,
	DEFAULT_CURRENCY,
	DEFAULT_TIMEZONE,
} from "#/features/schools/config/school.config";
import type {
	OnboardingFormValues,
	SchoolSettingsFormValues,
} from "#/features/schools/schema/school.schema";
import type {
	BillingCycle,
	Plan,
	OnboardSchoolPayload,
	School,
	UpdateSchoolPayload,
} from "#/features/schools/types/school.types";

function trimmed(value: string): string {
	return value.trim();
}

function trimmedOrNull(value: string): string | null {
	const next = value.trim();
	return next.length ? next : null;
}

/** Minimal owner details needed to seed the onboarding wizard. */
export interface OnboardingOwner {
	email?: string | null;
	phone?: string | null;
	mobile?: string | null;
	firstName?: string | null;
	lastName?: string | null;
}

/** Seeds the onboarding wizard with sensible defaults and the owner details. */
export function buildOnboardingDefaults(
	user: OnboardingOwner | null,
): OnboardingFormValues {
	const phone = user?.phone || user?.mobile || "";

	return {
		name: "",
		type: "school",
		email: user?.email ?? "",
		phone,
		website: "",
		description: "",

		address: {
			line1: "",
			line2: "",
			city: "",
			state: "",
			postalCode: "",
			country: DEFAULT_COUNTRY,
			timezone: DEFAULT_TIMEZONE,
		},
		currency: DEFAULT_CURRENCY,

		planId: "",
		billingCycle: "monthly",
		expectedStudents: "750",
		expectedBranches: "1",

		slug: "",
		customDomain: "",
		adminFirstName: user?.firstName ?? "",
		adminLastName: user?.lastName ?? "",
		adminEmail: user?.email ?? "",
		adminPhone: phone,

		acceptTerms: false,
	};
}

/** Maps the wizard form to the `POST /schools` payload. */
export function toOnboardPayload(
	values: OnboardingFormValues,
): OnboardSchoolPayload {
	return {
		name: trimmed(values.name),
		type: values.type,
		email: trimmed(values.email),
		phone: trimmedOrNull(values.phone),
		website: trimmedOrNull(values.website),
		description: trimmedOrNull(values.description),
		slug: trimmed(values.slug),
		customDomain: trimmedOrNull(values.customDomain),
		currency: values.currency,
		planId: values.planId,
		billingCycle: values.billingCycle,
		expectedStudents: Number.parseInt(values.expectedStudents, 10) || 0,
		expectedBranches: Number.parseInt(values.expectedBranches, 10) || 1,
		address: {
			line1: trimmed(values.address.line1),
			line2: trimmedOrNull(values.address.line2),
			city: trimmed(values.address.city),
			state: trimmedOrNull(values.address.state),
			postalCode: trimmedOrNull(values.address.postalCode),
			country: values.address.country,
			timezone: values.address.timezone,
		},
		admin: {
			firstName: trimmed(values.adminFirstName),
			lastName: trimmed(values.adminLastName),
			email: trimmed(values.adminEmail),
			phone: trimmedOrNull(values.adminPhone),
		},
		acceptTerms: values.acceptTerms,
	};
}

/** Seeds the settings form from an existing school. */
export function buildSchoolSettingsDefaults(
	school: School,
): SchoolSettingsFormValues {
	return {
		name: school.name,
		type: school.type,
		email: school.email,
		phone: school.phone ?? "",
		website: school.website ?? "",
		description: school.description ?? "",
		slug: school.slug,
		customDomain: school.customDomain ?? "",
		currency: school.currency,
		address: {
			line1: school.address.line1,
			line2: school.address.line2 ?? "",
			city: school.address.city,
			state: school.address.state ?? "",
			postalCode: school.address.postalCode ?? "",
			country: school.address.country,
			timezone: school.address.timezone,
		},
	};
}

/** Maps the settings form to the `PUT /schools/{id}` payload. */
export function toUpdateSchoolPayload(
	values: SchoolSettingsFormValues,
): UpdateSchoolPayload {
	return {
		name: trimmed(values.name),
		type: values.type,
		email: trimmed(values.email),
		phone: trimmedOrNull(values.phone),
		website: trimmedOrNull(values.website),
		description: trimmedOrNull(values.description),
		slug: trimmed(values.slug),
		customDomain: trimmedOrNull(values.customDomain),
		currency: values.currency,
		address: {
			line1: trimmed(values.address.line1),
			line2: trimmedOrNull(values.address.line2),
			city: trimmed(values.address.city),
			state: trimmedOrNull(values.address.state),
			postalCode: trimmedOrNull(values.address.postalCode),
			country: values.address.country,
			timezone: values.address.timezone,
		},
	};
}

/**
 * Maps Laravel validation keys (`plan_id`, `address.postal_code`,
 * `admin.first_name`, …) onto onboarding form paths.
 */
const API_FIELD_MAP: Record<string, string> = {
	name: "name",
	school_name: "name",
	business_name: "name",
	type: "type",
	business_type: "type",
	school_type: "type",
	email: "email",
	phone: "phone",
	website: "website",
	description: "description",
	slug: "slug",
	subdomain: "slug",
	custom_domain: "customDomain",
	currency: "currency",
	plan: "planId",
	plan_id: "planId",
	billing_cycle: "billingCycle",
	expected_students: "expectedStudents",
	expected_branches: "expectedBranches",
	"address.line1": "address.line1",
	"address.line_1": "address.line1",
	"address.line2": "address.line2",
	"address.line_2": "address.line2",
	"address.city": "address.city",
	"address.state": "address.state",
	"address.postal_code": "address.postalCode",
	"address.postalCode": "address.postalCode",
	"address.country": "address.country",
	"address.timezone": "address.timezone",
	"admin.first_name": "adminFirstName",
	"admin.last_name": "adminLastName",
	"admin.email": "adminEmail",
	"admin.phone": "adminPhone",
	admin_first_name: "adminFirstName",
	admin_last_name: "adminLastName",
	admin_email: "adminEmail",
	admin_phone: "adminPhone",
	accept_terms: "acceptTerms",
	terms: "acceptTerms",
};

export function mapOnboardingErrorField(field: string): string | null {
	return API_FIELD_MAP[field] ?? API_FIELD_MAP[field.toLowerCase()] ?? null;
}

/** Find a plan in the API-provided catalogue. */
export function getPlan(
	plans: Plan[],
	planId: string | null | undefined,
): Plan | null {
	if (!planId) return null;
	return (
		plans.find((plan) => plan.id === planId || plan.slug === planId) ?? null
	);
}

/** Normalised monthly cost, useful for comparing yearly vs monthly. */
export function monthlyEquivalent(plan: Plan, cycle: BillingCycle): number {
	return cycle === "yearly" ? plan.price.yearly / 12 : plan.price.monthly;
}

/** Percentage saved by paying yearly (0 when there is no yearly discount). */
export function yearlySavingPercent(plan: Plan): number {
	const fullYear = plan.price.monthly * 12;
	if (!fullYear || plan.price.yearly >= fullYear) return 0;
	return Math.round(((fullYear - plan.price.yearly) / fullYear) * 100);
}

/**
 * Suggests the cheapest plan that comfortably fits the expected size of the
 * institution, so the plan step can highlight a sensible default.
 */
export function recommendPlan(
	plans: Plan[],
	expectedStudents: number,
	expectedBranches: number,
): Plan | null {
	const fits = plans
		.filter(
			(plan) =>
				plan.limits.students >= expectedStudents &&
				plan.limits.branches >= expectedBranches,
		)
		.sort((a, b) => a.price.monthly - b.price.monthly);

	return fits[0] ?? plans[plans.length - 1] ?? null;
}
