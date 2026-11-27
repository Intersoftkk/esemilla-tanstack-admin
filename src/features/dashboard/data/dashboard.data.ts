// #/features/dashboard/data/dashboard.data.ts

export type ChangeTone = "positive" | "negative" | "neutral";

export type TenantStatus = "active" | "trial" | "suspended";

export type PaymentStatus = "paid" | "pending" | "failed";

export interface DashboardKpi {
	id: "tenants" | "mrr" | "subscriptions" | "tickets";
	label: string;
	value: string;
	change: string;
	tone: ChangeTone;
}

export interface RevenuePoint {
	month: string;
	mrr: number;
}

export interface PlanShare {
	plan: string;
	tenants: number;
	share: number;
	colorClass: string;
}

export interface TenantSummary {
	id: string;
	name: string;
	location: string;
	plan: string;
	status: TenantStatus;
	joined: string;
}

export interface PaymentSummary {
	id: string;
	tenant: string;
	method: string;
	amount: string;
	status: PaymentStatus;
	date: string;
}

export interface AttentionItem {
	id: "invoices" | "tenants" | "trials";
	label: string;
	value: string;
	hint: string;
	tone: ChangeTone;
	to: "/invoices" | "/schools" | "/subscriptions";
}

export const dashboardKpis: Array<DashboardKpi> = [
	{
		id: "tenants",
		label: "Active tenants",
		value: "128",
		change: "+6 this month",
		tone: "positive",
	},
	{
		id: "mrr",
		label: "Monthly recurring revenue",
		value: "$48,750",
		change: "+12.4% vs last month",
		tone: "positive",
	},
	{
		id: "subscriptions",
		label: "Active subscriptions",
		value: "96",
		change: "8 trials ending soon",
		tone: "neutral",
	},
	{
		id: "tickets",
		label: "Open support tickets",
		value: "17",
		change: "-4 vs last week",
		tone: "positive",
	},
];

export const revenueSeries: Array<RevenuePoint> = [
	{ month: "Dec", mrr: 31200 },
	{ month: "Jan", mrr: 33450 },
	{ month: "Feb", mrr: 34100 },
	{ month: "Mar", mrr: 36800 },
	{ month: "Apr", mrr: 37250 },
	{ month: "May", mrr: 39600 },
	{ month: "Jun", mrr: 41050 },
	{ month: "Jul", mrr: 40400 },
	{ month: "Aug", mrr: 42300 },
	{ month: "Sep", mrr: 44150 },
	{ month: "Oct", mrr: 46200 },
	{ month: "Nov", mrr: 48750 },
];

export const planMix: Array<PlanShare> = [
	{ plan: "Starter", tenants: 52, share: 41, colorClass: "bg-sky-500" },
	{ plan: "Growth", tenants: 48, share: 38, colorClass: "bg-primary" },
	{
		plan: "Enterprise",
		tenants: 28,
		share: 21,
		colorClass: "bg-violet-500",
	},
];

export const tenantTotals = {
	tenants: 128,
	averageRevenuePerTenant: "$381",
};

export const recentTenants: Array<TenantSummary> = [
	{
		id: "tn_1042",
		name: "Greenwood High",
		location: "Austin, TX",
		plan: "Enterprise",
		status: "active",
		joined: "Nov 22",
	},
	{
		id: "tn_1041",
		name: "Riverside Academy",
		location: "Portland, OR",
		plan: "Growth",
		status: "trial",
		joined: "Nov 20",
	},
	{
		id: "tn_1040",
		name: "Hillcrest International",
		location: "Denver, CO",
		plan: "Growth",
		status: "active",
		joined: "Nov 18",
	},
	{
		id: "tn_1039",
		name: "St. Xavier School",
		location: "Chicago, IL",
		plan: "Starter",
		status: "suspended",
		joined: "Nov 14",
	},
	{
		id: "tn_1038",
		name: "Bluebell Montessori",
		location: "Seattle, WA",
		plan: "Starter",
		status: "active",
		joined: "Nov 11",
	},
];

export const recentPayments: Array<PaymentSummary> = [
	{
		id: "INV-2041",
		tenant: "Greenwood High",
		method: "Visa •• 4242",
		amount: "$1,240.00",
		status: "paid",
		date: "Today",
	},
	{
		id: "INV-2040",
		tenant: "Riverside Academy",
		method: "Bank transfer",
		amount: "$620.00",
		status: "pending",
		date: "Today",
	},
	{
		id: "INV-2039",
		tenant: "Hillcrest International",
		method: "Mastercard •• 8210",
		amount: "$890.00",
		status: "paid",
		date: "Yesterday",
	},
	{
		id: "INV-2038",
		tenant: "St. Xavier School",
		method: "Visa •• 1107",
		amount: "$310.00",
		status: "failed",
		date: "Yesterday",
	},
	{
		id: "INV-2037",
		tenant: "Bluebell Montessori",
		method: "Bank transfer",
		amount: "$310.00",
		status: "paid",
		date: "Nov 24",
	},
];

export const attentionItems: Array<AttentionItem> = [
	{
		id: "invoices",
		label: "Overdue invoices",
		value: "9",
		hint: "$6,480 outstanding",
		tone: "negative",
		to: "/invoices",
	},
	{
		id: "tenants",
		label: "Suspended tenants",
		value: "3",
		hint: "Awaiting reactivation",
		tone: "neutral",
		to: "/schools",
	},
	{
		id: "trials",
		label: "Trials ending in 7 days",
		value: "8",
		hint: "Follow up to convert",
		tone: "positive",
		to: "/subscriptions",
	},
];
