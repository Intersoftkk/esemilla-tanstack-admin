// #/features/home/data/home.data.ts
import {
	BarChart3,
	CalendarCheck,
	CreditCard,
	GraduationCap,
	type LucideIcon,
	MessagesSquare,
	ShieldCheck,
	UserPlus,
	Users,
} from "lucide-react";

export interface HomeStat {
	id: string;
	value: string;
	label: string;
}

export interface HomeFeature {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

export interface HomeStep {
	id: string;
	title: string;
	description: string;
}

export interface HomePlan {
	id: "starter" | "growth" | "enterprise";
	name: string;
	price: string;
	cadence: string;
	blurb: string;
	features: Array<string>;
	featured?: boolean;
}

export const homeStats: Array<HomeStat> = [
	{ id: "schools", value: "1,240+", label: "Schools onboarded" },
	{ id: "students", value: "680k", label: "Students managed" },
	{ id: "uptime", value: "99.98%", label: "Platform uptime" },
	{ id: "countries", value: "12", label: "Countries served" },
];

export const homeFeatures: Array<HomeFeature> = [
	{
		id: "admissions",
		icon: UserPlus,
		title: "Admissions & onboarding",
		description:
			"Online applications, document checks and waitlists that turn into enrolled students without spreadsheets.",
	},
	{
		id: "students",
		icon: Users,
		title: "Students & guardians",
		description:
			"One profile per learner with guardians, classes, buses and medical notes kept in sync.",
	},
	{
		id: "attendance",
		icon: CalendarCheck,
		title: "Attendance & timetable",
		description:
			"Period-by-period registers, staff cover and clash-free timetables built in seconds.",
	},
	{
		id: "fees",
		icon: CreditCard,
		title: "Fees & invoicing",
		description:
			"Invoices, part payments, scholarships and receipts with automatic reminders to guardians.",
	},
	{
		id: "communication",
		icon: MessagesSquare,
		title: "Parent communication",
		description:
			"Announcements, SMS and email templates delivered to the right class, staff or guardian group.",
	},
	{
		id: "analytics",
		icon: BarChart3,
		title: "Insights & reporting",
		description:
			"Enrolment, collection and performance dashboards your leadership team can actually read.",
	},
];

export const homeSteps: Array<HomeStep> = [
	{
		id: "import",
		title: "Import your school",
		description:
			"Bring classes, staff and students across from Excel or your previous system in a guided onboarding.",
	},
	{
		id: "configure",
		title: "Set terms and fees",
		description:
			"Define academic sessions, grade bands, fee structures and the roles that can see each of them.",
	},
	{
		id: "run",
		title: "Run day-to-day operations",
		description:
			"Registers, invoices and messages go out from one console — with parents on the receiving end.",
	},
];

export const homePlans: Array<HomePlan> = [
	{
		id: "starter",
		name: "Starter",
		price: "$1.50",
		cadence: "per student / month",
		blurb: "For single-campus schools finding their feet.",
		features: [
			"Up to 300 students",
			"Admissions & records",
			"Attendance registers",
			"Guardian portal",
		],
	},
	{
		id: "growth",
		name: "Growth",
		price: "$2.80",
		cadence: "per student / month",
		blurb: "For growing groups that bill and report at scale.",
		features: [
			"Unlimited students",
			"Fees, invoices & receipts",
			"SMS + email templates",
			"Collection analytics",
			"Multi-campus reporting",
		],
		featured: true,
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: "Custom",
		cadence: "volume pricing",
		blurb: "For ministries and large networks with SLAs.",
		features: [
			"Everything in Growth",
			"SSO & audit trail",
			"Dedicated success manager",
			"99.98% uptime SLA",
		],
	},
];

export const homeHighlights: Array<{ icon: LucideIcon; label: string }> = [
	{ icon: ShieldCheck, label: "Role-based access for every campus" },
	{ icon: GraduationCap, label: "Built with schools, not around them" },
];
