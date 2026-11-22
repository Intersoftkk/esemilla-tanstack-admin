import type { BillingCycle, Plan } from "#/features/schools/types/school.types";

/**
 * Default plan catalogue.
 *
 * The onboarding wizard reads plans from `GET /plans` first (see
 * `services/plan.service.ts`) and only falls back to this catalogue when the
 * API is unavailable or returns nothing, so the UI keeps working while the
 * billing endpoints are being built out.
 */
export const PLAN_CATALOG: Plan[] = [
	{
		id: "starter",
		slug: "starter",
		name: "Starter",
		tagline: "For a single school finding its feet",
		price: { monthly: 29, yearly: 290 },
		currency: "USD",
		trialDays: 14,
		limits: {
			students: 500,
			staff: 25,
			branches: 1,
			storageGb: 5,
			customDomains: 0,
		},
		features: [
			"Student information system",
			"Attendance & timetable",
			"Gradebook & report cards",
			"Parent portal",
			"Email support",
		],
	},
	{
		id: "growth",
		slug: "growth",
		name: "Growth",
		tagline: "For growing institutions with a few campuses",
		price: { monthly: 79, yearly: 790 },
		currency: "USD",
		trialDays: 14,
		popular: true,
		limits: {
			students: 2000,
			staff: 120,
			branches: 3,
			storageGb: 25,
			customDomains: 2,
		},
		features: [
			"Everything in Starter",
			"Fees & online payments",
			"SMS + email notifications",
			"Exam & result automation",
			"Custom domain",
			"Priority support",
		],
	},
	{
		id: "enterprise",
		slug: "enterprise",
		name: "Enterprise",
		tagline: "For districts and multi-campus groups",
		price: { monthly: 199, yearly: 1990 },
		currency: "USD",
		trialDays: 30,
		limits: {
			students: 10000,
			staff: 500,
			branches: 25,
			storageGb: 100,
			customDomains: 10,
		},
		features: [
			"Everything in Growth",
			"Multi-campus analytics",
			"API access & webhooks",
			"SSO, audit logs & roles",
			"White-label branding",
			"Dedicated success manager",
		],
	},
];

export const DEFAULT_PLAN_ID = "growth";

export function getPlan(
	plans: Plan[],
	planId: string | null | undefined,
): Plan | null {
	if (!planId) return null;
	return (
		plans.find((plan) => plan.id === planId || plan.slug === planId) ??
		PLAN_CATALOG.find((plan) => plan.id === planId || plan.slug === planId) ??
		null
	);
}

/** Price billed today for the selected cycle. */
export function priceForCycle(plan: Plan, cycle: BillingCycle): number {
	return cycle === "yearly" ? plan.price.yearly : plan.price.monthly;
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
