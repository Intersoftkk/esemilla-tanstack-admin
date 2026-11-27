// #/config/permissions.config.ts

/**
 * Platform permissions used by this admin dashboard.
 *
 * This mirrors the backend `App\Enum\PlatformPermissionEnum` (PHP) one-to-one:
 * keys match the enum case names and values match the enum backing values.
 * Keep this file in sync with the backend whenever a case is added, renamed or
 * removed — the strings are the contract the API authorises against.
 */
export const PLATFORM_PERMISSIONS = {
	// Dashboard
	PlatformDashboardView: "platform.dashboard.view",

	// Tenant
	PlatformTenantView: "platform.tenant.view",
	PlatformTenantCreate: "platform.tenant.create",
	PlatformTenantEdit: "platform.tenant.edit",
	PlatformTenantDelete: "platform.tenant.delete",
	PlatformTenantSuspend: "platform.tenant.suspend",
	PlatformTenantActivate: "platform.tenant.activate",

	// Plan
	PlatformPlanView: "platform.plan.view",
	PlatformPlanCreate: "platform.plan.create",
	PlatformPlanEdit: "platform.plan.edit",
	PlatformPlanDelete: "platform.plan.delete",

	// Feature
	PlatformFeatureView: "platform.feature.view",
	PlatformFeatureCreate: "platform.feature.create",
	PlatformFeatureEdit: "platform.feature.edit",
	PlatformFeatureDelete: "platform.feature.delete",

	// Subscription
	PlatformSubscriptionView: "platform.subscription.view",
	PlatformSubscriptionCreate: "platform.subscription.create",
	PlatformSubscriptionEdit: "platform.subscription.edit",
	PlatformSubscriptionCancel: "platform.subscription.cancel",

	// Feature usage
	PlatformFeatureUsageView: "platform.feature-usage.view",
	PlatformFeatureUsageEdit: "platform.feature-usage.edit",

	// User (platform / central users)
	PlatformUserView: "platform.user.view",
	PlatformUserCreate: "platform.user.create",
	PlatformUserEdit: "platform.user.edit",
	PlatformUserDelete: "platform.user.delete",

	// Access control (roles, permissions and their assignments)
	PlatformRoleView: "platform.role.view",
	PlatformRoleCreate: "platform.role.create",
	PlatformRoleEdit: "platform.role.edit",
	PlatformRoleDelete: "platform.role.delete",
	PlatformPermissionView: "platform.permission.view",
	PlatformUserRoleView: "platform.user-role.view",
	PlatformUserRoleAssign: "platform.user-role.assign",
	PlatformUserPermissionView: "platform.user-permission.view",
	PlatformUserPermissionAssign: "platform.user-permission.assign",
	PlatformRolePermissionView: "platform.role-permission.view",
	PlatformRolePermissionAssign: "platform.role-permission.assign",

	// Payments / settlement
	PlatformPaymentView: "platform.payment.view",
	PlatformPaymentCreate: "platform.payment.create",
	PlatformPaymentDelete: "platform.payment.delete",

	// Impersonation
	PlatformImpersonate: "platform.impersonate",

	// Audit log
	PlatformAuditLogView: "platform.audit-log.view",

	// Admin profile
	PlatformAdminView: "platform.admin.view",
	PlatformAdminCreate: "platform.admin.create",
	PlatformAdminEdit: "platform.admin.edit",
	PlatformAdminDelete: "platform.admin.delete",

	// Owner profile
	PlatformOwnerView: "platform.owner.view",
	PlatformOwnerCreate: "platform.owner.create",
	PlatformOwnerEdit: "platform.owner.edit",
	PlatformOwnerDelete: "platform.owner.delete",

	// Invoice / billing
	PlatformInvoiceView: "platform.invoice.view",
	PlatformInvoiceCreate: "platform.invoice.create",
	PlatformInvoiceEdit: "platform.invoice.edit",
	PlatformInvoiceDelete: "platform.invoice.delete",
	PlatformInvoiceExport: "platform.invoice.export",

	// Domain
	PlatformDomainView: "platform.domain.view",
	PlatformDomainCreate: "platform.domain.create",
	PlatformDomainEdit: "platform.domain.edit",
	PlatformDomainDelete: "platform.domain.delete",

	// Setting
	PlatformSettingView: "platform.setting.view",
	PlatformSettingCreate: "platform.setting.create",
	PlatformSettingEdit: "platform.setting.edit",
	PlatformSettingDelete: "platform.setting.delete",
} as const;
