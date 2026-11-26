import {
	BILLING_CYCLES,
	type BillingCycle,
	type Plan,
	SCHOOL_STATUSES,
	SCHOOL_TYPES,
	type School,
	type SchoolAddress,
	type SchoolContact,
	type SchoolStatus,
	type SchoolType,
	type SchoolUsage,
} from "#/features/schools/types/school.types";

/**
 * The API may return Laravel resources, plain objects or a mix of
 * snake_case/camelCase keys depending on the endpoint version. These helpers
 * normalise the payload once so the rest of the feature can rely on a single
 * strongly typed shape.
 */

type RawRecord = Record<string, unknown>;

function isRecord(value: unknown): value is RawRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): RawRecord {
	return isRecord(value) ? value : {};
}

function toText(value: unknown): string | null {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length ? trimmed : null;
	}
	if (typeof value === "number") return String(value);
	return null;
}

function firstText(...values: unknown[]): string | null {
	for (const value of values) {
		const text = toText(value);
		if (text !== null) return text;
	}
	return null;
}

function toNumber(value: unknown, fallback = 0): number {
	const numeric =
		typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
	return Number.isFinite(numeric) ? numeric : fallback;
}

function toBoolean(value: unknown): boolean {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value === 1;
	if (typeof value === "string") {
		return ["1", "true", "yes", "verified"].includes(value.toLowerCase());
	}
	return false;
}

function toStatus(value: unknown): SchoolStatus {
	const text = String(value ?? "").toLowerCase();
	return SCHOOL_STATUSES.includes(text as SchoolStatus)
		? (text as SchoolStatus)
		: "pending";
}

function toType(value: unknown): SchoolType {
	const text = String(value ?? "").toLowerCase();
	return SCHOOL_TYPES.includes(text as SchoolType)
		? (text as SchoolType)
		: "other";
}

function toBillingCycle(value: unknown): BillingCycle {
	const text = String(value ?? "").toLowerCase();
	return BILLING_CYCLES.includes(text as BillingCycle)
		? (text as BillingCycle)
		: "monthly";
}

/* -------------------------------------------------------------------------- */
/*  Payload unwrapping                                                        */
/* -------------------------------------------------------------------------- */

/** Handles `[]`, `{ data: [] }` and `{ data: { data: [] } }`. */
export function unwrapList(payload: unknown): unknown[] {
	if (Array.isArray(payload)) return payload;

	const root = asRecord(payload);
	if (Array.isArray(root.data)) return root.data;

	const nested = asRecord(root.data);
	if (Array.isArray(nested.data)) return nested.data;

	return [];
}

/** Handles `{}`, `{ data: {} }` and `{ data: { data: {} } }`. */
export function unwrapEntity(payload: unknown): RawRecord | null {
	const root = asRecord(payload);
	if (!Object.keys(root).length) return null;

	const data = asRecord(root.data);
	if (Object.keys(data).length) {
		const deep = asRecord(data.data);
		return Object.keys(deep).length ? deep : data;
	}

	return root;
}

/* -------------------------------------------------------------------------- */
/*  Plans                                                                     */
/* -------------------------------------------------------------------------- */

export function normalizePlan(input: unknown): Plan | null {
	const raw = asRecord(input);
	if (!Object.keys(raw).length) return null;

	const id = firstText(raw.id, raw.slug, raw.key);
	if (!id) return null;

	const priceRecord = asRecord(raw.price);
	const flatPrice =
		typeof raw.price === "number" || typeof raw.price === "string"
			? raw.price
			: undefined;
	const monthly = toNumber(
		priceRecord.monthly ?? raw.price_monthly ?? raw.monthly_price ?? flatPrice,
		0,
	);
	const yearly = toNumber(
		priceRecord.yearly ?? raw.price_yearly ?? raw.yearly_price,
		Math.round(monthly * 10),
	);

	const limitsRecord = asRecord(raw.limits);
	const features = Array.isArray(raw.features)
		? raw.features
				.map((feature) =>
					typeof feature === "string"
						? feature
						: firstText(asRecord(feature).label, asRecord(feature).name),
				)
				.filter((feature): feature is string => Boolean(feature))
		: [];

	return {
		id,
		slug: firstText(raw.slug, raw.id) ?? id,
		name: firstText(raw.name, raw.title) ?? "Plan",
		tagline: firstText(raw.tagline, raw.description) ?? "",
		price: { monthly, yearly },
		currency: firstText(raw.currency, raw.currency_code) ?? "USD",
		trialDays: toNumber(raw.trial_days ?? raw.trialDays, 14),
		popular: toBoolean(raw.popular ?? raw.is_popular),
		limits: {
			students: toNumber(
				limitsRecord.students ?? raw.max_students ?? raw.students_limit,
				0,
			),
			staff: toNumber(
				limitsRecord.staff ?? raw.max_staff ?? raw.staff_limit,
				0,
			),
			branches: toNumber(
				limitsRecord.branches ?? raw.max_branches ?? raw.branch_limit,
				1,
			),
			storageGb: toNumber(
				limitsRecord.storageGb ?? limitsRecord.storage_gb ?? raw.storage_gb,
				0,
			),
			customDomains: toNumber(
				limitsRecord.customDomains ??
					limitsRecord.custom_domains ??
					raw.custom_domains,
				0,
			),
		},
		features,
	};
}

/* -------------------------------------------------------------------------- */
/*  Schools                                                                   */
/* -------------------------------------------------------------------------- */

export function normalizeAddress(
	raw: unknown,
	root: RawRecord = {},
): SchoolAddress {
	const address = asRecord(raw);

	return {
		line1:
			firstText(
				address.line1,
				address.street,
				address.address_line_1,
				root.address_line_1,
			) ?? "",
		line2: firstText(address.line2, address.address_line_2),
		city: firstText(address.city, root.city) ?? "",
		state: firstText(address.state, address.province, root.state),
		postalCode: firstText(
			address.postalCode,
			address.postal_code,
			address.zip,
			root.postal_code ?? root.postalCode,
		),
		country:
			firstText(address.country, address.country_code, root.country) ?? "",
		timezone:
			firstText(address.timezone, address.time_zone, root.timezone) ?? "UTC",
	};
}

function normalizeContactFromRoot(root: RawRecord): SchoolContact | null {
	const name = firstText(root.owner_name, root.contact_name);
	const email = firstText(root.owner_email, root.contact_email);
	if (!name && !email) return null;

	return {
		name: name ?? "",
		email: email ?? "",
		phone: firstText(root.owner_phone, root.contact_phone),
	};
}

function normalizeContact(raw: unknown): SchoolContact | null {
	const contact = asRecord(raw);
	const email = firstText(contact.email);
	if (!email && !firstText(contact.name)) return null;
	return {
		name: firstText(contact.name, contact.full_name) ?? "",
		email: email ?? "",
		phone: firstText(contact.phone, contact.mobile),
	};
}

function normalizeUsage(raw: unknown, root: RawRecord = {}): SchoolUsage {
	const usage = asRecord(raw);

	return {
		students: toNumber(
			usage.students ??
				usage.students_count ??
				usage.total_students ??
				root.students_count ??
				root.total_students,
			0,
		),
		staff: toNumber(
			usage.staff ??
				usage.staff_count ??
				usage.total_staff ??
				root.staff_count ??
				root.total_staff,
			0,
		),
		branches: toNumber(
			usage.branches ??
				usage.branches_count ??
				usage.campuses ??
				root.branches_count ??
				root.campuses,
			1,
		),
		storageGb: toNumber(
			usage.storageGb ?? usage.storage_gb ?? usage.storage ?? root.storage_gb,
			0,
		),
	};
}

export function normalizeSchool(input: unknown): School | null {
	const raw = asRecord(input);
	const id = firstText(raw.id, raw.uuid, raw.slug);
	if (!id) return null;

	const plan = normalizePlan(raw.plan);

	const subdomain = firstText(raw.subdomain, raw.slug) ?? "";
	const rawAddress = asRecord(raw.address);
	const contact =
		normalizeContact(raw.contact) ??
		normalizeContact(raw.owner) ??
		normalizeContact(raw.admin) ??
		normalizeContactFromRoot(raw);

	return {
		id,
		name:
			firstText(raw.name, raw.school_name, raw.business_name) ??
			"Untitled school",
		slug: firstText(raw.slug) ?? subdomain,
		subdomain,
		customDomain: firstText(raw.custom_domain, raw.customDomain),
		customDomainVerified: toBoolean(
			raw.custom_domain_verified ?? raw.customDomainVerified,
		),
		type: toType(raw.type ?? raw.business_type ?? raw.school_type),
		status: toStatus(raw.status),
		plan,
		planId: firstText(raw.plan_id, raw.planId, plan?.id),
		billingCycle: toBillingCycle(raw.billing_cycle ?? raw.billingCycle),
		description: firstText(raw.description, raw.about),
		website: firstText(raw.website, raw.url),
		email: firstText(raw.email, raw.contact_email) ?? "",
		phone: firstText(raw.phone, raw.mobile, raw.contact_phone),
		currency: firstText(raw.currency, raw.currency_code) ?? "USD",
		logoUrl: firstText(raw.logo_url, raw.logo, raw.avatar),
		address: normalizeAddress(rawAddress, raw),
		contact,
		usage: normalizeUsage(raw.usage, raw),
		trialEndsAt: firstText(raw.trial_ends_at, raw.trialEndsAt),
		createdAt: firstText(raw.created_at, raw.createdAt) ?? "",
		updatedAt: firstText(raw.updated_at, raw.updatedAt),
	};
}
