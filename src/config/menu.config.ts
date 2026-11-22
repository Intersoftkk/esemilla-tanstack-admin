// src/config/navigation/admin.ts

import {
    LayoutDashboard,
    Building2,
    CreditCard,
    Receipt,
    Wallet,
    LifeBuoy,
    MessageSquare,
    BellRing,
    Shield,
    Package,
    Mail,
} from "lucide-react";

import type { NavGroup } from "#/types/navigation";

export const adminNavigation: Array<NavGroup> = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Overview",
                description: "Platform health, tenants, and revenue",
                url: "/dashboard",
                icon: LayoutDashboard,
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
            },
            {
                title: "Subscriptions",
                description: "Active, trial, and cancelled subscriptions",
                url: "/subscriptions",
                icon: CreditCard,
            },
            {
                title: "Invoices",
                description: "All tenant invoices and payment status",
                url: "/invoices",
                icon: Receipt,
            },
            {
                title: "Payments",
                description: "Payment history and failed charges",
                url: "/payments",
                icon: Wallet,
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
            },
        ],
    },
] as const;