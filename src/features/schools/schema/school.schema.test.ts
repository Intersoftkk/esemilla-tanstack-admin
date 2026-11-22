import { describe, expect, it } from "vitest";

import {
	onboardSchoolPayloadSchema,
	slugSchema,
} from "#/features/schools/schema/school.schema";

describe("schools schemas", () => {
	it("enforces valid workspace slugs", () => {
		expect(slugSchema.safeParse("greenwood-academy").success).toBe(true);
		expect(slugSchema.safeParse("ab").success).toBe(false);
		expect(slugSchema.safeParse("-leading-hyphen").success).toBe(false);
		expect(slugSchema.safeParse("UpperCase").success).toBe(false);
	});

	it("validates structured onboarding payload", () => {
		const parsed = onboardSchoolPayloadSchema.safeParse({
			name: "Greenwood Academy",
			type: "school",
			email: "admin@greenwood.edu",
			phone: "+1 555 200 3000",
			website: "https://greenwood.edu",
			description: null,
			slug: "greenwood-academy",
			customDomain: null,
			currency: "USD",
			planId: "growth",
			billingCycle: "yearly",
			expectedStudents: 1200,
			expectedBranches: 2,
			address: {
				line1: "100 Academy Way",
				line2: null,
				city: "Austin",
				state: "TX",
				postalCode: "78701",
				country: "US",
				timezone: "America/Chicago",
			},
			admin: {
				firstName: "Sarah",
				lastName: "Mitchell",
				email: "sarah@greenwood.edu",
				phone: null,
			},
			acceptTerms: true,
		});

		expect(parsed.success).toBe(true);
	});
});
