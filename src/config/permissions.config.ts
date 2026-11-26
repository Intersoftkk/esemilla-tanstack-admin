// #/config/permissions.config.ts

/**
 * Permissions used by this admin project. Names mirror the backend permission
 * strings; anything unrelated to the admin dashboard is intentionally omitted.
 */
export const PERMISSIONS = {
    // Dashboard
    ViewDashboard: 'can-view-dashboard',

    // Tenants / schools
    ViewSchool: 'can-view-school',
    CreateSchool: 'can-add-school',
    EditSchool: 'can-edit-school',
    DeleteSchool: 'can-delete-school',
    ExportSchool: 'can-export-school',

    // Plans
    ViewPlan: 'can-view-plan',
    CreatePlan: 'can-add-plan',
    EditPlan: 'can-edit-plan',
    DeletePlan: 'can-delete-plan',
    ManagePlanFeatures: 'can-manage-plan-features',

    // Features
    ViewFeature: 'can-view-feature',
    CreateFeature: 'can-add-feature',
    EditFeature: 'can-edit-feature',
    DeleteFeature: 'can-delete-feature',

    // Billing
    ViewSubscription: 'can-view-subscription',
    ViewInvoice: 'can-view-invoice',
    ViewPayment: 'can-view-payment',
    ManageBilling: 'can-manage-billing',

    // Support
    ViewTicket: 'can-view-ticket',
    ManageTicket: 'can-manage-ticket',
    ViewFeedback: 'can-view-feedback',
    ViewAnnouncement: 'can-view-announcement',
    ManageAnnouncement: 'can-manage-announcement',

    // Notifications & system
    ViewNotification: 'can-view-notification',
    ManageNotification: 'can-manage-notification',
    ViewBackup: 'can-view-backup',
    ManageBackup: 'can-manage-backup',
    ViewSystemSettings: 'can-view-system-settings',
    EditSystemSettings: 'can-edit-system-settings',
    ViewSecuritySettings: 'can-view-security-settings',
    ManageSecuritySettings: 'can-manage-security-settings',

    // Access control
    ViewRole: 'can-view-role',
    CreateRole: 'can-add-role',
    EditRole: 'can-edit-role',
    ViewUser: 'can-view-user',
    CreateUser: 'can-add-user',
    EditUser: 'can-edit-user',
    ViewPermission: 'can-view-permission',
} as const

/** Portal-level access checks used by the admin shell. */
export const PORTAL_PERMISSIONS = {
    ADMIN: 'can-access-admin-portal',
} as const
