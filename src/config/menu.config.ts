// #/config/menu.config.ts

import {
	BellRing,
	Building2,
	CreditCard,
	LayoutDashboard,
	LifeBuoy,
	Mail,
	MessageSquare,
	Package,
	Receipt,
	Shield,
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
			},
			{
				title: "Feedback",
				description: "Product feedback and feature requests",
				url: "/feedback",
				icon: MessageSquare,
			},
			{
				title: "Announcements",
				description: "Platform-wide notices to tenants",
				url: "/announcements",
				icon: Mail,
			},
		],
	},
	{
		title: "System",
		items: [
			{
				title: "Notifications",
				description: "Email, SMS & in-app notification templates",
				url: "/notifications",
				icon: BellRing,
			},
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
