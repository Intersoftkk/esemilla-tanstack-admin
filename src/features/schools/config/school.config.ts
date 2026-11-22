import {
	Baby,
	BookOpenCheck,
	Building2,
	GraduationCap,
	Landmark,
	type LucideIcon,
	Presentation,
	School as SchoolIcon,
} from "lucide-react";

import type {
	BillingCycle,
	SchoolStatus,
	SchoolType,
} from "#/features/schools/types/school.types";

export interface SchoolTypeOption {
	value: SchoolType;
	label: string;
	description: string;
	icon: LucideIcon;
}

export const SCHOOL_TYPE_OPTIONS: SchoolTypeOption[] = [
	{
		value: "school",
		label: "K-12 school",
		description: "Primary, middle or high school",
		icon: SchoolIcon,
	},
	{
		value: "college",
		label: "College",
		description: "Undergraduate institution",
		icon: GraduationCap,
	},
	{
		value: "university",
		label: "University",
		description: "Multi-faculty higher education",
		icon: Landmark,
	},
	{
		value: "kindergarten",
		label: "Kindergarten / preschool",
		description: "Early years learning centre",
		icon: Baby,
	},
	{
		value: "training-center",
		label: "Training centre",
		description: "Skill and certification programmes",
		icon: BookOpenCheck,
	},
	{
		value: "coaching",
		label: "Coaching institute",
		description: "Test prep and tutoring",
		icon: Presentation,
	},
	{
		value: "other",
		label: "Other business",
		description: "Any other education business",
		icon: Building2,
	},
];

export function getSchoolTypeMeta(type: SchoolType | string): SchoolTypeOption {
	return (
		SCHOOL_TYPE_OPTIONS.find((option) => option.value === type) ??
		SCHOOL_TYPE_OPTIONS[SCHOOL_TYPE_OPTIONS.length - 1]
	);
}

export interface SchoolStatusMeta {
	label: string;
	description: string;
	/** Classes applied to the status `Badge`. */
	badgeClassName: string;
	/** Small dot used inside the badge. */
	dotClassName: string;
	/** Top accent bar used on school cards. */
	accentClassName: string;
}

export const SCHOOL_STATUS_META: Record<SchoolStatus, SchoolStatusMeta> = {
	pending: {
		label: "Pending review",
		description: "Waiting for verification before the portal goes live.",
		badgeClassName:
			"border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
		dotClassName: "bg-amber-500",
		accentClassName: "from-amber-400 to-orange-500",
	},
	active: {
		label: "Active",
		description: "The portal is live and the subscription is running.",
		badgeClassName:
			"border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
		dotClassName: "bg-emerald-500",
		accentClassName: "from-emerald-400 to-teal-600",
	},
	suspended: {
		label: "Suspended",
		description: "Access is blocked, all data is kept safe.",
		badgeClassName:
			"border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400",
		dotClassName: "bg-rose-500",
		accentClassName: "from-rose-400 to-pink-600",
	},
	archived: {
		label: "Archived",
		description: "Read-only workspace, hidden from the team.",
		badgeClassName: "border-border bg-muted text-muted-foreground",
		dotClassName: "bg-muted-foreground",
		accentClassName:
			"from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600",
	},
};

export const BILLING_CYCLE_OPTIONS: Array<{
	value: BillingCycle;
	label: string;
	hint: string;
}> = [
	{ value: "monthly", label: "Monthly", hint: "Pay month to month" },
	{ value: "yearly", label: "Yearly", hint: "Two months free" },
];

/** A short, curated IANA timezone list for the onboarding form. */
export const TIMEZONE_OPTIONS = [
	{ value: "Asia/Kolkata", label: "Asia/Kolkata (IST, UTC+5:30)" },
	{ value: "Asia/Dhaka", label: "Asia/Dhaka (BST, UTC+6)" },
	{ value: "Asia/Karachi", label: "Asia/Karachi (PKT, UTC+5)" },
	{ value: "Asia/Kathmandu", label: "Asia/Kathmandu (NPT, UTC+5:45)" },
	{ value: "Asia/Colombo", label: "Asia/Colombo (IST, UTC+5:30)" },
	{ value: "Asia/Dubai", label: "Asia/Dubai (GST, UTC+4)" },
	{ value: "Asia/Riyadh", label: "Asia/Riyadh (AST, UTC+3)" },
	{ value: "Asia/Singapore", label: "Asia/Singapore (SGT, UTC+8)" },
	{ value: "Asia/Hong_Kong", label: "Asia/Hong_Kong (HKT, UTC+8)" },
	{ value: "Asia/Tokyo", label: "Asia/Tokyo (JST, UTC+9)" },
	{ value: "Asia/Shanghai", label: "Asia/Shanghai (CST, UTC+8)" },
	{ value: "Asia/Jakarta", label: "Asia/Jakarta (WIB, UTC+7)" },
	{ value: "Asia/Manila", label: "Asia/Manila (PHT, UTC+8)" },
	{ value: "Europe/London", label: "Europe/London (GMT/BST)" },
	{ value: "Europe/Paris", label: "Europe/Paris (CET)" },
	{ value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
	{ value: "Europe/Madrid", label: "Europe/Madrid (CET)" },
	{ value: "Europe/Amsterdam", label: "Europe/Amsterdam (CET)" },
	{ value: "Europe/Istanbul", label: "Europe/Istanbul (TRT, UTC+3)" },
	{ value: "Africa/Cairo", label: "Africa/Cairo (EET, UTC+2)" },
	{ value: "Africa/Lagos", label: "Africa/Lagos (WAT, UTC+1)" },
	{ value: "Africa/Nairobi", label: "Africa/Nairobi (EAT, UTC+3)" },
	{ value: "Africa/Johannesburg", label: "Africa/Johannesburg (SAST, UTC+2)" },
	{ value: "America/New_York", label: "America/New_York (ET)" },
	{ value: "America/Chicago", label: "America/Chicago (CT)" },
	{ value: "America/Denver", label: "America/Denver (MT)" },
	{ value: "America/Los_Angeles", label: "America/Los_Angeles (PT)" },
	{ value: "America/Toronto", label: "America/Toronto (ET)" },
	{ value: "America/Mexico_City", label: "America/Mexico_City (CST)" },
	{ value: "America/Sao_Paulo", label: "America/Sao_Paulo (BRT, UTC-3)" },
	{ value: "Australia/Sydney", label: "Australia/Sydney (AEDT)" },
	{ value: "Australia/Perth", label: "Australia/Perth (AWST, UTC+8)" },
	{ value: "Pacific/Auckland", label: "Pacific/Auckland (NZDT)" },
];

/** Currencies commonly used by the institutions we onboard. */
export const CURRENCY_OPTIONS = [
	{ value: "USD", label: "USD — US Dollar" },
	{ value: "EUR", label: "EUR — Euro" },
	{ value: "GBP", label: "GBP — British Pound" },
	{ value: "INR", label: "INR — Indian Rupee" },
	{ value: "AED", label: "AED — UAE Dirham" },
	{ value: "SAR", label: "SAR — Saudi Riyal" },
	{ value: "BDT", label: "BDT — Bangladeshi Taka" },
	{ value: "PKR", label: "PKR — Pakistani Rupee" },
	{ value: "LKR", label: "LKR — Sri Lankan Rupee" },
	{ value: "NPR", label: "NPR — Nepalese Rupee" },
	{ value: "SGD", label: "SGD — Singapore Dollar" },
	{ value: "AUD", label: "AUD — Australian Dollar" },
	{ value: "CAD", label: "CAD — Canadian Dollar" },
	{ value: "ZAR", label: "ZAR — South African Rand" },
	{ value: "NGN", label: "NGN — Nigerian Naira" },
	{ value: "KES", label: "KES — Kenyan Shilling" },
];

/** Used until the owner picks a country in the onboarding form. */
export const DEFAULT_COUNTRY = "IN";
export const DEFAULT_TIMEZONE = "Asia/Kolkata";
export const DEFAULT_CURRENCY = "USD";

/** Sort options exposed on the schools list. */
export const SCHOOL_SORT_OPTIONS = [
	{ value: "newest", label: "Newest first" },
	{ value: "name", label: "Name (A–Z)" },
	{ value: "students", label: "Most students" },
] as const;

export type SchoolSort = (typeof SCHOOL_SORT_OPTIONS)[number]["value"];
