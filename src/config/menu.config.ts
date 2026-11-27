// #/config/menu.config.ts

import {
	Building2,
	CreditCard,
	LayoutDashboard,
	LifeBuoy,
	Package,
	Receipt,
	Shield,
	ShieldCheck,
	Users,
	Wallet,
} from "lucide-react";

import { PLATFORM_PERMISSIONS } from "#/config/permissions.config.ts";
import type { NavGroup } from "#/types/navigation";

/**
 * Sidebar navigation for the platform admin portal.
 *
 * `permissions` gates an item against the current user's granted platform
 * permissions (see `NavGroup` / `usePermission`). Items without a mapping in
 * the backend `PlatformPermissionEnum` stay ungated.
 */
export const adminNavigation: Array<NavGroup> = [
	{
		title: "Dashboard",
		items: [
			{
				title: "Overview",
				description: "Platform health, tenants, and revenue",
				url: "/dashboard",
				icon: LayoutDashboard,
				permissions: [PLATFORM_PERMISSIONS.PlatformDashboardView],
			},
		],
	},
	{
		title: "Tenants",
		items: [
			{
				title: "All Schools",
				description: "List and manage all tenant schools",
				url: "/schools",
				icon: Building2,
				permissions: [PLATFORM_PERMISSIONS.PlatformTenantView],
			},
		],
	},
	{
		title: "Access Control",
		items: [
			{
				title: "Users",
				description: "Platform users and their assigned roles",
				url: "/users",
				icon: Users,
				permissions: [PLATFORM_PERMISSIONS.PlatformUserView],
			},
			{
				title: "Role Permissions",
				description: "Roles, permissions and their assignments",
				url: "/role-permissions",
				icon: ShieldCheck,
				permissions: [PLATFORM_PERMISSIONS.PlatformRolePermissionView],
			},
		],
	},
	{
		title: "Plans & Billing",
		items: [
			{
				title: "Plans",
				description: "Subscription plans and pricing",
				url: "/plans",
				icon: Package,
				permissions: [PLATFORM_PERMISSIONS.PlatformPlanView],
			},
			{
				title: "Subscriptions",
				description: "Active, trial, and cancelled subscriptions",
				url: "/subscriptions",
				icon: CreditCard,
				permissions: [PLATFORM_PERMISSIONS.PlatformSubscriptionView],
			},
			{
				title: "Invoices",
				description: "All tenant invoices and payment status",
				url: "/invoices",
				icon: Receipt,
				permissions: [PLATFORM_PERMISSIONS.PlatformInvoiceView],
			},
			{
				title: "Payments",
				description: "Payment history and failed charges",
				url: "/payments",
				icon: Wallet,
				permissions: [PLATFORM_PERMISSIONS.PlatformPaymentView],
			},
		],
	},
	{
		title: "Support",
		items: [
			{
				title: "Tickets",
				description: "Support tickets from all tenants",
				url: "/support",
				icon: LifeBuoy,
				permissions: [PLATFORM_PERMISSIONS.PlatformTicketView],
			},
		],
	},
	{
		title: "System",
		items: [
			{
				title: "Security",
				description: "SSO, access policies, and compliance",
				url: "/security",
				icon: Shield,
				permissions: [PLATFORM_PERMISSIONS.PlatformSettingView],
			},
		],
	},
];
