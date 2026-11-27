import { format, isValid, parseISO } from "date-fns";

import { env } from "#/env";

import { SCHOOL_STATUS_META } from "#/features/schools/config/school.config";
import type {
	BillingCycle,
	Plan,
	School,
	SchoolStats,
	SchoolStatus,
	SchoolUsage,
} from "#/features/schools/types/schools.type";

/** Root domain used to build the hosted portal hostname. */
export const PORTAL_ROOT_DOMAIN = env.VITE_ROOT_DOMAIN ?? "schoolportal.app";

/* -------------------------------------------------------------------------- */
/*  Formatting                                                                */
/* -------------------------------------------------------------------------- */

export function formatMoney(
	amount: number,
	currency = "USD",
	options: Intl.NumberFormatOptions = {},
): string {
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
			...options,
		}).format(amount);
	} catch {
		return `${currency} ${amount.toFixed(0)}`;
	}
}

export function formatCompactNumber(value: number): string {
	return new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

export function formatSchoolDate(value?: string | null): string {
	if (!value) return "—";
	const date = parseISO(value);
	return isValid(date) ? format(date, "dd MMM yyyy") : "—";
}

/** Human readable status label, e.g. `active` -> `Active`. */
export function schoolStatusLabel(status: SchoolStatus): string {
	return SCHOOL_STATUS_META[status]?.label ?? status;
}

export function schoolInitials(name: string): string {
	const initials = name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase() ?? "")
		.join("");

	return initials || "SC";
}

const AVATAR_GRADIENTS = [
	"from-emerald-500 to-teal-600",
	"from-sky-500 to-indigo-600",
	"from-amber-500 to-orange-600",
	"from-rose-500 to-pink-600",
	"from-violet-500 to-purple-600",
	"from-lime-500 to-green-600",
	"from-cyan-500 to-blue-600",
];

/** Stable gradient per school name so avatars keep their colour. */
export function schoolGradient(name: string): string {
	let hash = 0;
	for (let index = 0; index < name.length; index += 1) {
		hash = (hash * 31 + name.charCodeAt(index)) % 100000;
	}
	return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

/* -------------------------------------------------------------------------- */
/*  Portals                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Hostname of the school portal: a verified custom domain wins, otherwise the
 * hosted `subdomain.root-domain` address.
 */
export function portalHost(school: School): string | null {
	if (school.customDomain && school.customDomainVerified) {
		return school.customDomain;
	}
	if (school.subdomain) {
		return `${school.subdomain}.${PORTAL_ROOT_DOMAIN}`;
	}
	if (school.customDomain) {
		return school.customDomain;
	}
	return null;
}

export function portalUrl(school: School): string | null {
	const host = portalHost(school);
	return host ? `https://${host}` : null;
}

/* -------------------------------------------------------------------------- */
/*  Usage                                                                     */
/* -------------------------------------------------------------------------- */

/** Percentage of a plan limit that has been consumed (capped at 100). */
export function usagePercent(used: number, limit: number): number {
	if (!Number.isFinite(limit) || limit <= 0) return 0;
	return Math.min(100, Math.round((used / limit) * 100));
}

/** `students` consumed vs. the plan's student allowance. */
export function usageRows(
	usage: SchoolUsage,
	plan: Plan | null,
): Array<{ key: string; label: string; used: number; limit: number }> {
	const limits = plan?.limits;
	return [
		{
			key: "students",
			label: "Students",
			used: usage.students,
			limit: limits?.students ?? 0,
		},
		{
			key: "staff",
			label: "Staff accounts",
			used: usage.staff,
			limit: limits?.staff ?? 0,
		},
		{
			key: "branches",
			label: "Campuses",
			used: usage.branches,
			limit: limits?.branches ?? 0,
		},
		{
			key: "storage",
			label: "Storage (GB)",
			used: usage.storageGb,
			limit: limits?.storageGb ?? 0,
		},
	];
}

/* -------------------------------------------------------------------------- */
/*  Aggregates                                                                */
/* -------------------------------------------------------------------------- */

export function computeSchoolStats(schools: School[]): SchoolStats {
	return schools.reduce<SchoolStats>(
		(stats, school) => {
			stats.total += 1;
			stats.students += school.usage.students;
			stats.staff += school.usage.staff;
			stats.branches += school.usage.branches;
			if (school.customDomain && school.customDomainVerified) {
				stats.customDomains += 1;
			}
			if (school.status === "active") stats.active += 1;
			if (school.status === "pending") stats.pending += 1;
			if (school.status === "suspended") stats.suspended += 1;
			return stats;
		},
		{
			total: 0,
			active: 0,
			pending: 0,
			suspended: 0,
			students: 0,
			staff: 0,
			branches: 0,
			customDomains: 0,
		},
	);
}

/* -------------------------------------------------------------------------- */
/*  Slugs & CSV                                                               */
/* -------------------------------------------------------------------------- */

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 40);
}

function csvCell(value: string | number | null | undefined): string {
	const text = value === null || value === undefined ? "" : String(value);
	return `"${text.replace(/"/g, '""')}"`;
}

export function schoolsToCsv(schools: School[]): string {
	const header = [
		"Name",
		"Type",
		"Status",
		"Plan",
		"Billing cycle",
		"Students",
		"Staff",
		"Campuses",
		"Portal URL",
		"Custom domain",
		"Country",
		"Created at",
	];

	const rows = schools.map((school) => [
		school.name,
		school.type,
		schoolStatusLabel(school.status),
		school.plan?.name ?? "—",
		school.billingCycle,
		school.usage.students,
		school.usage.staff,
		school.usage.branches,
		portalUrl(school) ?? "",
		school.customDomain ?? "",
		school.address.country,
		school.createdAt,
	]);

	return [header, ...rows]
		.map((row) => row.map(csvCell).join(","))
		.join("\r\n");
}

/** Triggers a client-side CSV download. No-op during SSR. */
export function downloadCsv(filename: string, contents: string): void {
	if (typeof window === "undefined") return;

	const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}

export async function copyToClipboard(value: string): Promise<boolean> {
	if (typeof navigator === "undefined" || !navigator.clipboard) return false;
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
}

/* -------------------------------------------------------------------------- */
/*  API errors                                                                */
/* -------------------------------------------------------------------------- */

/** Best-effort human readable message for a failed API call. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof Error && error.message) return error.message;
	return fallback;
}

/** Price billed today for the selected cycle. */
export function priceForCycle(plan: Plan, cycle: BillingCycle): number {
	return cycle === "yearly" ? plan.price.yearly : plan.price.monthly;
}
