/**
 * Single source of truth for the platform admin API routes.
 *
 * Mirrors `routes/api.php` of the backend one-to-one (every `v1/admin` route in
 * that file has an entry here). Nothing in `src/features/**` should hard-code an
 * admin path — import it from this map so a route change only lands in one file.
 *
 * `BACKEND_API_URL` already includes `/api`, so the final URL becomes
 * `{BACKEND_API_URL}/v1/admin/...`.
 */

export const ADMIN_API_PREFIX = "/v1/admin";

/** Joins the admin prefix with a resource path. */
export function adminPath(path = ""): string {
	const suffix = path.startsWith("/") ? path : `/${path}`;
	return `${ADMIN_API_PREFIX}${suffix === "/" ? "" : suffix}`;
}

/** URL-encodes a route parameter. */
function seg(value: string | number): string {
	return encodeURIComponent(String(value));
}

export type RouteParam = string | number;

export const adminApi = {
	/* Public (throttle: platform-login) */
	auth: {
		login: adminPath("/login"),
		ownerLogin: adminPath("/owner/login"),
		me: adminPath("/me"),
		logout: adminPath("/logout"),
	},

	/* Dashboard / platform statistics */
	dashboard: {
		index: adminPath("/dashboard"),
		stats: adminPath("/dashboard/stats"),
		revenue: adminPath("/dashboard/revenue"),
		tenantsGrowth: adminPath("/dashboard/tenants-growth"),
	},

	/* Central users */
	users: {
		index: adminPath("/users"),
		store: adminPath("/users"),
		show: (user: RouteParam) => adminPath(`/users/${seg(user)}`),
		update: (user: RouteParam) => adminPath(`/users/${seg(user)}`),
		destroy: (user: RouteParam) => adminPath(`/users/${seg(user)}`),
		passwordReset: (user: RouteParam) =>
			adminPath(`/users/${seg(user)}/password-reset`),
		revokeTokens: (user: RouteParam) =>
			adminPath(`/users/${seg(user)}/revoke-tokens`),
	},

	/* Access control */
	access: {
		permissions: adminPath("/permissions"),
		permission: (permission: RouteParam) =>
			adminPath(`/permissions/${seg(permission)}`),
		roles: adminPath("/roles"),
		role: (role: RouteParam) => adminPath(`/roles/${seg(role)}`),
		rolePermissions: (role: RouteParam) =>
			adminPath(`/roles/${seg(role)}/permissions`),
		rolePermission: (role: RouteParam, permission: RouteParam) =>
			adminPath(`/roles/${seg(role)}/permissions/${seg(permission)}`),
		userRoles: (user: RouteParam) => adminPath(`/user/${seg(user)}/roles`),
		userRole: (user: RouteParam, role: RouteParam) =>
			adminPath(`/user/${seg(user)}/roles/${seg(role)}`),
		userPermissions: (user: RouteParam) =>
			adminPath(`/user/${seg(user)}/permissions`),
		userPermission: (user: RouteParam, permission: RouteParam) =>
			adminPath(`/user/${seg(user)}/permissions/${seg(permission)}`),
	},

	/* Tenants / businesses (admin lifecycle) */
	tenants: {
		index: adminPath("/tenants"),
		store: adminPath("/tenants"),
		show: (tenant: RouteParam) => adminPath(`/tenants/${seg(tenant)}`),
		update: (tenant: RouteParam) => adminPath(`/tenants/${seg(tenant)}`),
		destroy: (tenant: RouteParam) => adminPath(`/tenants/${seg(tenant)}`),
		status: (tenant: RouteParam) => adminPath(`/tenants/${seg(tenant)}/status`),
		suspend: (tenant: RouteParam) =>
			adminPath(`/tenants/${seg(tenant)}/suspend`),
		activate: (tenant: RouteParam) =>
			adminPath(`/tenants/${seg(tenant)}/activate`),
		retry: (tenant: RouteParam) => adminPath(`/tenants/${seg(tenant)}/retry`),
		export: adminPath("/tenants/export"),
		bulkSuspend: adminPath("/tenants/bulk-suspend"),
		bulkActivate: adminPath("/tenants/bulk-activate"),
		bulkDelete: adminPath("/tenants/bulk-delete"),
		featureUsage: (tenant: RouteParam) =>
			adminPath(`/tenants/${seg(tenant)}/feature-usage`),
		changePlan: (tenant: RouteParam) =>
			adminPath(`/tenants/${seg(tenant)}/change-plan`),
		cancel: (tenant: RouteParam) => adminPath(`/tenants/${seg(tenant)}/cancel`),
		cancelNow: (tenant: RouteParam) =>
			adminPath(`/tenants/${seg(tenant)}/cancel-now`),
		resume: (tenant: RouteParam) => adminPath(`/tenants/${seg(tenant)}/resume`),
	},

	/* Plans */
	plans: {
		index: adminPath("/plans"),
		store: adminPath("/plans"),
		show: (plan: RouteParam) => adminPath(`/plans/${seg(plan)}`),
		update: (plan: RouteParam) => adminPath(`/plans/${seg(plan)}`),
		destroy: (plan: RouteParam) => adminPath(`/plans/${seg(plan)}`),
		attachFeatures: (plan: RouteParam) =>
			adminPath(`/plans/${seg(plan)}/attach-features`),
		syncFeatures: (plan: RouteParam) =>
			adminPath(`/plans/${seg(plan)}/sync-features`),
		detachFeature: (plan: RouteParam, feature: RouteParam) =>
			adminPath(`/plans/${seg(plan)}/features/${seg(feature)}`),
	},

	/* Features */
	features: {
		index: adminPath("/features"),
		store: adminPath("/features"),
		show: (feature: RouteParam) => adminPath(`/features/${seg(feature)}`),
		update: (feature: RouteParam) => adminPath(`/features/${seg(feature)}`),
		destroy: (feature: RouteParam) => adminPath(`/features/${seg(feature)}`),
	},

	/* Feature usage / consumption per tenant */
	featureUsage: {
		index: adminPath("/feature-usage"),
		show: (featureUsage: RouteParam) =>
			adminPath(`/feature-usage/${seg(featureUsage)}`),
		update: (featureUsage: RouteParam) =>
			adminPath(`/feature-usage/${seg(featureUsage)}`),
		reset: (featureUsage: RouteParam) =>
			adminPath(`/feature-usage/${seg(featureUsage)}/reset`),
	},

	/* Subscriptions */
	subscriptions: {
		index: adminPath("/subscriptions"),
		store: adminPath("/subscriptions"),
		show: (subscription: RouteParam) =>
			adminPath(`/subscriptions/${seg(subscription)}`),
		update: (subscription: RouteParam) =>
			adminPath(`/subscriptions/${seg(subscription)}`),
	},

	/* Domains */
	domains: {
		index: adminPath("/domains"),
		store: adminPath("/domains"),
		show: (domain: RouteParam) => adminPath(`/domains/${seg(domain)}`),
		update: (domain: RouteParam) => adminPath(`/domains/${seg(domain)}`),
		destroy: (domain: RouteParam) => adminPath(`/domains/${seg(domain)}`),
	},

	/* Invoices / billing */
	invoices: {
		index: adminPath("/invoices"),
		store: adminPath("/invoices"),
		show: (invoice: RouteParam) => adminPath(`/invoices/${seg(invoice)}`),
		update: (invoice: RouteParam) => adminPath(`/invoices/${seg(invoice)}`),
		destroy: (invoice: RouteParam) => adminPath(`/invoices/${seg(invoice)}`),
		summary: adminPath("/invoices/summary"),
		export: adminPath("/invoices/export"),
		trashed: adminPath("/invoices/trashed"),
		bulkIssue: adminPath("/invoices/bulk-issue"),
		restore: (invoice: RouteParam) =>
			adminPath(`/invoices/${seg(invoice)}/restore`),
		forceDestroy: (invoice: RouteParam) =>
			adminPath(`/invoices/${seg(invoice)}/force`),
		pdf: (invoice: RouteParam) => adminPath(`/invoices/${seg(invoice)}/pdf`),
		email: (invoice: RouteParam) =>
			adminPath(`/invoices/${seg(invoice)}/email`),
		markPaid: (invoice: RouteParam) =>
			adminPath(`/invoices/${seg(invoice)}/mark-paid`),
		markCancelled: (invoice: RouteParam) =>
			adminPath(`/invoices/${seg(invoice)}/mark-cancelled`),
	},

	/* Invoice payments (partial payments / refunds / settlement ledger) */
	payments: {
		index: adminPath("/payments"),
		store: adminPath("/payments"),
		show: (payment: RouteParam) => adminPath(`/payments/${seg(payment)}`),
		destroy: (payment: RouteParam) => adminPath(`/payments/${seg(payment)}`),
		trashed: adminPath("/payments/trashed"),
		restore: (payment: RouteParam) =>
			adminPath(`/payments/${seg(payment)}/restore`),
		forceDestroy: (payment: RouteParam) =>
			adminPath(`/payments/${seg(payment)}/force`),
	},

	/* Platform settings */
	settings: {
		index: adminPath("/settings"),
		store: adminPath("/settings"),
		show: (setting: RouteParam) => adminPath(`/settings/${seg(setting)}`),
		update: (setting: RouteParam) => adminPath(`/settings/${seg(setting)}`),
		destroy: (setting: RouteParam) => adminPath(`/settings/${seg(setting)}`),
		groups: adminPath("/settings/groups"),
		bulk: adminPath("/settings/bulk"),
	},

	/* Admin profiles (central admins) */
	admins: {
		index: adminPath("/admins"),
		store: adminPath("/admins"),
		show: (admin: RouteParam) => adminPath(`/admins/${seg(admin)}`),
		update: (admin: RouteParam) => adminPath(`/admins/${seg(admin)}`),
		destroy: (admin: RouteParam) => adminPath(`/admins/${seg(admin)}`),
		trashed: adminPath("/admins/trashed"),
		restore: (admin: RouteParam) => adminPath(`/admins/${seg(admin)}/restore`),
		forceDestroy: (admin: RouteParam) =>
			adminPath(`/admins/${seg(admin)}/force`),
		status: (admin: RouteParam) => adminPath(`/admins/${seg(admin)}/status`),
	},

	/* Owner profiles (central owners) */
	owners: {
		index: adminPath("/owners"),
		store: adminPath("/owners"),
		show: (owner: RouteParam) => adminPath(`/owners/${seg(owner)}`),
		update: (owner: RouteParam) => adminPath(`/owners/${seg(owner)}`),
		destroy: (owner: RouteParam) => adminPath(`/owners/${seg(owner)}`),
		lookup: adminPath("/owners/lookup"),
		tenants: (owner: RouteParam) => adminPath(`/owners/${seg(owner)}/tenants`),
		trashed: adminPath("/owners/trashed"),
		restore: (owner: RouteParam) => adminPath(`/owners/${seg(owner)}/restore`),
		forceDestroy: (owner: RouteParam) =>
			adminPath(`/owners/${seg(owner)}/force`),
		status: (owner: RouteParam) => adminPath(`/owners/${seg(owner)}/status`),
	},

	/* Audit trail */
	auditLogs: {
		index: adminPath("/audit-logs"),
		show: (auditLog: RouteParam) => adminPath(`/audit-logs/${seg(auditLog)}`),
		record: (type: RouteParam, id: RouteParam) =>
			adminPath(`/audit-logs/record/${seg(type)}/${seg(id)}`),
	},

	/* Impersonation (support tooling) */
	impersonation: {
		user: (user: RouteParam) => adminPath(`/impersonate/user/${seg(user)}`),
		tenantUser: adminPath("/impersonate/tenant-user"),
		context: adminPath("/impersonate/context"),
		stop: adminPath("/impersonate/stop"),
	},
} as const;

/** Flat list of every admin route template, handy for docs and smoke tests. */
export const ADMIN_ROUTE_TEMPLATES: Array<string> = [
	"/login",
	"/owner/login",
	"/me",
	"/logout",
	"/dashboard",
	"/dashboard/stats",
	"/dashboard/revenue",
	"/dashboard/tenants-growth",
	"/users",
	"/users/{user}",
	"/users/{user}/password-reset",
	"/users/{user}/revoke-tokens",
	"/permissions",
	"/permissions/{permission}",
	"/roles",
	"/roles/{role}",
	"/roles/{role}/permissions",
	"/roles/{role}/permissions/{permission}",
	"/user/{user}/roles",
	"/user/{user}/roles/{role}",
	"/user/{user}/permissions",
	"/user/{user}/permissions/{permission}",
	"/tenants",
	"/tenants/{tenant}",
	"/tenants/{tenant}/status",
	"/tenants/{tenant}/suspend",
	"/tenants/{tenant}/activate",
	"/tenants/{tenant}/retry",
	"/tenants/export",
	"/tenants/bulk-suspend",
	"/tenants/bulk-activate",
	"/tenants/bulk-delete",
	"/tenants/{tenant}/feature-usage",
	"/tenants/{tenant}/change-plan",
	"/tenants/{tenant}/cancel",
	"/tenants/{tenant}/cancel-now",
	"/tenants/{tenant}/resume",
	"/plans",
	"/plans/{plan}",
	"/plans/{plan}/attach-features",
	"/plans/{plan}/sync-features",
	"/plans/{plan}/features/{feature}",
	"/features",
	"/features/{feature}",
	"/feature-usage",
	"/feature-usage/{featureUsage}",
	"/feature-usage/{featureUsage}/reset",
	"/subscriptions",
	"/subscriptions/{subscription}",
	"/domains",
	"/domains/{domain}",
	"/invoices",
	"/invoices/{invoice}",
	"/invoices/summary",
	"/invoices/export",
	"/invoices/trashed",
	"/invoices/bulk-issue",
	"/invoices/{invoice}/restore",
	"/invoices/{invoice}/force",
	"/invoices/{invoice}/pdf",
	"/invoices/{invoice}/email",
	"/invoices/{invoice}/mark-paid",
	"/invoices/{invoice}/mark-cancelled",
	"/payments",
	"/payments/{payment}",
	"/payments/trashed",
	"/payments/{payment}/restore",
	"/payments/{payment}/force",
	"/settings",
	"/settings/{setting}",
	"/settings/groups",
	"/settings/bulk",
	"/admins",
	"/admins/{admin}",
	"/admins/trashed",
	"/admins/{admin}/restore",
	"/admins/{admin}/force",
	"/admins/{admin}/status",
	"/owners",
	"/owners/{owner}",
	"/owners/lookup",
	"/owners/{owner}/tenants",
	"/owners/trashed",
	"/owners/{owner}/restore",
	"/owners/{owner}/force",
	"/owners/{owner}/status",
	"/audit-logs",
	"/audit-logs/{auditLog}",
	"/audit-logs/record/{type}/{id}",
	"/impersonate/user/{user}",
	"/impersonate/tenant-user",
	"/impersonate/context",
	"/impersonate/stop",
].map((path) => adminPath(path));
