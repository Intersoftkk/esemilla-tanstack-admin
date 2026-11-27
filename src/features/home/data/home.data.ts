// #/features/home/data/home.data.ts
import {
	BarChart3,
	BellRing,
	Building2,
	CreditCard,
	LifeBuoy,
	type LucideIcon,
	Receipt,
	ShieldCheck,
	Users,
} from "lucide-react";

export interface PlatformStat {
	id: string;
	value: string;
	label: string;
}

export interface ConsoleModule {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
}

export interface DeskStep {
	id: string;
	title: string;
	description: string;
}

export interface AccessRole {
	id: string;
	name: string;
	scope: string;
	can: Array<string>;
}

export const platformStats: Array<PlatformStat> = [
	{ id: "tenants", value: "1,284", label: "Schools on the platform" },
	{ id: "sla", value: "2h", label: "First-response SLA" },
	{ id: "resolution", value: "96%", label: "Tickets resolved in SLA" },
	{ id: "uptime", value: "99.98%", label: "Rolling 30-day uptime" },
];

export const consoleModules: Array<ConsoleModule> = [
	{
		id: "dashboard",
		icon: BarChart3,
		title: "Platform overview",
		description:
			"Tenants, MRR, subscriptions and the open ticket count on one screen — with the numbers that need action first.",
	},
	{
		id: "tenants",
		icon: Building2,
		title: "Tenants",
		description:
			"Onboard schools, assign plans, suspend or reactivate access, and see each campus's status history.",
	},
	{
		id: "billing",
		icon: CreditCard,
		title: "Plans & subscriptions",
		description:
			"Publish plans, move tenants between tiers and track trials, renewals and cancellations.",
	},
	{
		id: "invoices",
		icon: Receipt,
		title: "Invoices & payments",
		description:
			"Chase overdue invoices, reconcile payments and export billing history per tenant.",
	},
	{
		id: "support",
		icon: LifeBuoy,
		title: "Support desk",
		description:
			"Tickets from every tenant in one queue: priority, status, assignee and the full conversation thread.",
	},
	{
		id: "users",
		icon: Users,
		title: "Users & roles",
		description:
			"Invite the platform team, grant role permissions per module and revoke access the moment someone leaves.",
	},
	{
		id: "notifications",
		icon: BellRing,
		title: "Notifications",
		description:
			"Email, SMS and in-app templates that go out to tenants and guardians, with delivery history.",
	},
	{
		id: "security",
		icon: ShieldCheck,
		title: "Security & audit",
		description:
			"SSO, session policy, impersonation rules and an audit trail behind every administrative change.",
	},
];

export const deskSteps: Array<DeskStep> = [
	{
		id: "triage",
		title: "Triage the queue",
		description:
			"New tickets land in one queue with tenant, priority and SLA clock already attached — no inbox archaeology.",
	},
	{
		id: "resolve",
		title: "Resolve with context",
		description:
			"Open the tenant's plan, invoices and history right next to the ticket before you answer.",
	},
	{
		id: "record",
		title: "Everything is logged",
		description:
			"Status changes, impersonations and permission edits are recorded, so handovers and audits are painless.",
	},
];

export const accessRoles: Array<AccessRole> = [
	{
		id: "owner",
		name: "Platform owner",
		scope: "Full console",
		can: [
			"Manage tenants and plans",
			"Grant or revoke roles",
			"Impersonate tenants",
			"Read the audit log",
		],
	},
	{
		id: "support",
		name: "Support agent",
		scope: "Desk & tenants",
		can: [
			"Work the ticket queue",
			"View tenant details",
			"Read invoices",
			"Update ticket status",
		],
	},
	{
		id: "billing",
		name: "Billing admin",
		scope: "Revenue only",
		can: [
			"Manage plans and subscriptions",
			"Issue and void invoices",
			"Reconcile payments",
			"Export financial reports",
		],
	},
];
