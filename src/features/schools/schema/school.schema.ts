import { z } from "zod";

import {
	BILLING_CYCLES,
	SCHOOL_TYPES,
} from "#/features/schools/types/schools.type";

const PHONE_REGEX = /^\+?[\d\s\-()]{7,20}$/;
const DOMAIN_REGEX =
	/^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i;

/** Workspace subdomain: 3–40 chars, lowercase, numbers and hyphens only. */
export const slugSchema = z
	.string()
	.trim()
	.min(3, "Workspace URL must be at least 3 characters")
	.max(40, "Workspace URL must be at most 40 characters")
	.regex(
		/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
		"Use lowercase letters, numbers and hyphens only (cannot start or end with a hyphen)",
	);

const websiteSchema = z
	.string()
	.trim()
	.max(255, "Website URL is too long")
	.refine(
		(value) => value === "" || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(value),
		"Enter a full URL including http:// or https://",
	);

const customDomainSchema = z
	.string()
	.trim()
	.max(253, "Domain is too long")
	.refine(
		(value) => value === "" || DOMAIN_REGEX.test(value),
		"Enter a valid domain, e.g. portal.yourschool.edu",
	);

const phoneSchema = z
	.string()
	.trim()
	.refine(
		(value) => value === "" || PHONE_REGEX.test(value),
		"Enter a valid phone number",
	);

export const schoolAddressSchema = z.object({
	line1: z
		.string()
		.trim()
		.min(2, "Street address is required")
		.max(160, "Street address is too long"),
	line2: z.string().trim().max(160, "Address line is too long"),
	city: z
		.string()
		.trim()
		.min(2, "City is required")
		.max(80, "City is too long"),
	state: z.string().trim().max(80, "State is too long"),
	postalCode: z.string().trim().max(16, "Postal code is too long"),
	country: z.string().trim().length(2, "Select a country"),
	timezone: z.string().trim().min(1, "Select a timezone"),
});

export type SchoolAddressValues = z.infer<typeof schoolAddressSchema>;

/**
 * The full onboarding form: business profile, location, plan, workspace and
 * the owner account that will administer the school.
 *
 * Everything is a plain string/boolean/enum (no transforms or defaults) so the
 * form input type and output type stay identical for react-hook-form.
 */
export const onboardingSchema = z.object({
	// Step 1 — business profile
	name: z
		.string()
		.trim()
		.min(2, "Business name must be at least 2 characters")
		.max(120, "Business name must be at most 120 characters"),
	type: z.enum(SCHOOL_TYPES),
	email: z
		.string()
		.trim()
		.min(1, "Email is required")
		.email("Enter a valid email address"),
	phone: phoneSchema,
	website: websiteSchema,
	description: z
		.string()
		.trim()
		.max(600, "Description must be at most 600 characters"),

	// Step 2 — location & locale
	address: schoolAddressSchema,
	currency: z.string().trim().length(3, "Select a currency"),

	// Step 3 — subscription plan
	planId: z.string().trim().min(1, "Choose a plan to continue"),
	billingCycle: z.enum(BILLING_CYCLES),
	expectedStudents: z
		.string()
		.trim()
		.min(1, "Enter an approximate number of students")
		.regex(/^\d{1,7}$/, "Enter a number between 0 and 9,999,999"),
	expectedBranches: z
		.string()
		.trim()
		.min(1, "Enter the number of campuses")
		.regex(/^\d{1,3}$/, "Enter a number between 1 and 999"),

	// Step 4 — workspace & owner
	slug: slugSchema,
	customDomain: customDomainSchema,
	adminFirstName: z
		.string()
		.trim()
		.min(2, "First name must be at least 2 characters")
		.max(50, "First name is too long"),
	adminLastName: z
		.string()
		.trim()
		.min(2, "Last name must be at least 2 characters")
		.max(50, "Last name is too long"),
	adminEmail: z
		.string()
		.trim()
		.min(1, "Owner email is required")
		.email("Enter a valid email address"),
	adminPhone: phoneSchema,

	// Step 5 — review
	acceptTerms: z
		.boolean()
		.refine((value) => value, "Please accept the terms to continue"),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

/** Fields that can be edited after a school has been created. */
export const schoolSettingsSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Business name must be at least 2 characters")
		.max(120, "Business name must be at most 120 characters"),
	type: z.enum(SCHOOL_TYPES),
	email: z
		.string()
		.trim()
		.min(1, "Email is required")
		.email("Enter a valid email address"),
	phone: phoneSchema,
	website: websiteSchema,
	description: z
		.string()
		.trim()
		.max(600, "Description must be at most 600 characters"),
	slug: slugSchema,
	customDomain: customDomainSchema,
	address: schoolAddressSchema,
	currency: z.string().trim().length(3, "Select a currency"),
});

export type SchoolSettingsFormValues = z.infer<typeof schoolSettingsSchema>;

export const schoolIdSchema = z
	.string()
	.trim()
	.min(1, "School identifier is required");

export const schoolListFiltersSchema = z.object({
	search: z.string().optional(),
	status: z.enum(["pending", "active", "suspended", "archived"]).optional(),
});

export const slugCheckSchema = z.object({
	slug: slugSchema,
});

export const schoolStatusInputSchema = z.object({
	id: schoolIdSchema,
	status: z.enum(["pending", "active", "suspended", "archived"]),
});

export const onboardSchoolPayloadSchema = z.object({
	name: z.string().trim().min(2),
	type: z.enum(SCHOOL_TYPES),
	email: z.string().trim().email(),
	phone: z.string().nullable(),
	website: z.string().nullable(),
	description: z.string().nullable(),
	slug: slugSchema,
	customDomain: z.string().nullable(),
	currency: z.string().trim().length(3),
	planId: z.string().trim().min(1),
	billingCycle: z.enum(BILLING_CYCLES),
	expectedStudents: z.number().int().min(0),
	expectedBranches: z.number().int().min(1),
	address: z.object({
		line1: z.string().trim().min(2),
		line2: z.string().nullable(),
		city: z.string().trim().min(2),
		state: z.string().nullable(),
		postalCode: z.string().nullable(),
		country: z.string().trim().length(2),
		timezone: z.string().trim().min(1),
	}),
	admin: z.object({
		firstName: z.string().trim().min(2),
		lastName: z.string().trim().min(2),
		email: z.string().trim().email(),
		phone: z.string().nullable(),
	}),
	acceptTerms: z.boolean(),
});

export const updateSchoolInputSchema = z.object({
	id: schoolIdSchema,
	payload: z.object({
		name: z.string().trim().min(2).optional(),
		type: z.enum(SCHOOL_TYPES).optional(),
		email: z.string().trim().email().optional(),
		phone: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		slug: slugSchema.optional(),
		customDomain: z.string().nullable().optional(),
		currency: z.string().trim().length(3).optional(),
		planId: z.string().trim().min(1).optional(),
		billingCycle: z.enum(BILLING_CYCLES).optional(),
		address: z
			.object({
				line1: z.string().trim().min(2),
				line2: z.string().nullable(),
				city: z.string().trim().min(2),
				state: z.string().nullable(),
				postalCode: z.string().nullable(),
				country: z.string().trim().length(2),
				timezone: z.string().trim().min(1),
			})
			.optional(),
	}),
});
