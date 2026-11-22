export const PERMISSIONS = {
    // Organization Chart
    ViewOrgChart: "can-view-org-chart",

    // Countries
    ViewCountry: "can-view-country",
    CreateCountry: "can-add-country",
    EditCountry: "can-edit-country",

    ViewWeekendConfig:   'can-view-weekend-config',
    CreateWeekendConfig: 'can-add-weekend-config',
    EditWeekendConfig:   'can-edit-weekend-config',
    DeleteWeekendConfig: 'can-delete-weekend-config',

    ViewFinancialYearConfig:   'can-view-financial-year-config',
    CreateFinancialYearConfig: 'can-add-financial-year-config',
    EditFinancialYearConfig:   'can-edit-financial-year-config',
    DeleteFinancialYearConfig: 'can-delete-financial-year-config',

    ViewLeaveType:   'can-view-leave-type',
    CreateLeaveType: 'can-add-leave-type',
    EditLeaveType:   'can-edit-leave-type',
    DeleteLeaveType: 'can-delete-leave-type',

    // approval-delegations
    ViewApprovalDelegation: "can-view-approval-delegation",
    CreateApprovalDelegation: "can-add-approval-delegation",
    EditApprovalDelegation: "can-edit-approval-delegation",
    DeleteApprovalDelegation: "can-delete-approval-delegation",

    ViewLeavePolicy:   'can-view-leave-policy',
    CreateLeavePolicy: 'can-add-leave-policy',
    EditLeavePolicy:   'can-edit-leave-policy',
    DeleteLeavePolicy: 'can-delete-leave-policy',

    // Cities
    ViewCity: "can-view-city",
    CreateCity: "can-add-city",
    EditCity: "can-edit-city",

    // Clients
    ViewClient: "can-view-client",
    CreateClient: "can-add-client",
    EditClient: "can-edit-client",
    DeleteClient: "can-delete-client",
    ExportClient: "can-export-client",

    // Client Sites
    ViewClientSite: "can-view-client-site",
    CreateClientSite: "can-add-client-site",
    EditClientSite: "can-edit-client-site",
    DeleteClientSite: "can-delete-client-site",

    // Partners
    ViewPartner: "can-view-partner",
    CreatePartner: "can-add-partner",
    EditPartner: "can-edit-partner",
    DeletePartner: "can-delete-partner",
    ExportPartner: "can-export-partner",
    ResendWelcomeEmailToPartner: "can-resend-welcome-email-to-partner",

    // Employees
    ViewEmployee: "can-view-employee",
    AddEmployee: "can-add-employee",
    EditEmployee: "can-edit-employee",
    DeleteEmployee: "can-delete-employee",
    ExportEmployee: "can-export-employee",

    // Employee Types
    ViewEmployeeType: "can-view-employee-type",
    AddEmployeeType: "can-add-employee-type",
    EditEmployeeType: "can-edit-employee-type",

    // Employee Attendance
    ViewEmployeeAttendance: "can-view-employee-attendance",
    AddEmployeeAttendance: "can-add-employee-attendance",
    EditEmployeeAttendance: "can-edit-employee-attendance",
    DeleteEmployeeAttendance: "can-delete-employee-attendance",

    // Staff Availabilities
    ViewStaffAvailability: "can-view-staff-availability",

    // Timesheets (general)
    ViewTimesheet: "can-view-timesheet",
    AddTimesheet: "can-add-timesheet",
    EditTimesheet: "can-edit-timesheet",
    DeleteTimesheet: "can-delete-timesheet",
    ChangeTimesheetStatus: "can-change-timesheet-status",

    // Employee Timesheets (specific)
    ViewEmployeeTimesheet: "can-view-employee-timesheet",
    AddEmployeeTimesheet: "can-add-employee-timesheet",
    EditEmployeeTimesheet: "can-edit-employee-timesheet",
    DeleteEmployeeTimesheet: "can-delete-employee-timesheet",

    // Leave Requests & History
    ViewEmployeeLeaveRequest: "can-view-leaves-request",
    CreateEmployeeLeaveRequest: "can-add-leave-request",
    EditEmployeeLeaveRequest: "can-edit-leave-request",
    DeleteEmployeeLeaveRequest: "can-delete-leave-request",

    // Older leave naming (still exists in DB)
    ViewLeaveApplication: "can-view-leave-application",
    CreateLeaveApplication: "can-create-leave-application",
    EditLeaveApplication: "can-edit-leave-application",
    DeleteLeaveApplication: "can-delete-leave-application",
    ExportLeaveApplication: "can-export-leave-application",

    // Support Tickets
    ViewSupportTicket: "can-view-support-ticket",
    CreateSupportTicket: "can-add-support-ticket",
    EditSupportTicket: "can-edit-support-ticket",
    DeleteSupportTicket: "can-delete-support-ticket",

    // Expenses
    ViewExpense: "can-view-expense",
    AddExpense: "can-add-expense",
    EditExpense: "can-edit-expense",
    ExportExpense: "can-export-expense",
    ChangeExpenseStatus: "can-change-expense-status",

    // Vendors
    ViewVendor: "can-view-vendor",
    AddVendor: "can-add-vendor",
    EditVendor: "can-edit-vendor",
    DeleteVendor: "can-delete-vendor",

    // Employee Expenses
    ViewEmployeeExpense: "can-view-employee-expense",
    CreateEmployeeExpense: "can-add-employee-expense",
    EditEmployeeExpense: "can-edit-employee-expense",
    DeleteEmployeeExpense: "can-delete-employee-expense",
    ChangeEmployeeExpenseStatus: "can-change-employee-expense-status",
    ExportEmployeeExpense: "can-export-employee-expense",

    //Corporate Expenses
    ViewCorporateExpense: "can-view-corporate-expense",
    AddCorporateExpense: "can-add-corporate-expense",
    EditCorporateExpense: "can-edit-corporate-expense",
    ExportCorporateExpense: "can-export-corporate-expense",
    DeleteCorporateExpense: "can-delete-corporate-expense",
    ChangeCorporateExpenseStatus: "can-change-corporate-expense-status",

    // Expense Categories
    ViewExpenseCategory: "can-view-expense-category",
    AddExpenseCategory: "can-add-expense-category",
    EditExpenseCategory: "can-edit-expense-category",
    DeleteExpenseCategory: "can-delete-expense-category",

    // Expense Approval Workflow
    ViewExpenseApprovalWorkflow: "can-view-expense-approval-workflow",
    AddExpenseApprovalWorkflow: "can-add-expense-approval-workflow",
    EditExpenseApprovalWorkflow: "can-edit-expense-approval-workflow",
    DeleteExpenseApprovalWorkflow: "can-delete-expense-approval-workflow",


    ViewEmploymentProcessTemplate: "can-view-employment-process-template",
    AddEmploymentProcessTemplate: "can-add-employment-process-template",
    EditEmploymentProcessTemplate: "can-edit-employment-process-template",
    DeleteEmploymentProcessTemplate: "can-delete-employment-process-template",

    // Expense Cost Centers
    ViewExpenseCostCenter: "can-view-expense-cost-center",
    AddExpenseCostCenter: "can-add-expense-cost-center",
    EditExpenseCostCenter: "can-edit-expense-cost-center",
    DeleteExpenseCostCenter: "can-delete-expense-cost-center",

    // Holidays
    ViewHoliday: "can-view-holiday",
    AddHoliday: "can-add-holiday",
    EditHoliday: "can-edit-holiday",
    ExportHoliday: "can-export-holiday",

    // Projects
    ViewProject: "can-view-project",
    AddProject: "can-add-project",
    EditProject: "can-edit-project",
    ExportProject: "can-export-project",

    // BGV Checks
    ViewBGV: "can-view-bgv",
    AddBGV: "can-add-bgv",
    EditBGV: "can-edit-bgv",
    ExportBGV: "can-export-bgv",

    // Deal Tracking
    ViewDeal: "can-view-deal",
    AddDeal: "can-add-deal",
    EditDeal: "can-edit-deal",
    ExportDeal: "can-export-deal",
    DeleteDeal: "can-delete-deal",

    // Settings
    ViewAppSettings: "can-view-app-settings",
    EditAppSettings: "can-edit-app-settings",

    // Permissions & Roles
    ViewPermission: "can-view-permission",
    AddPermission: "can-add-permission",
    EditPermission: "can-edit-permission",

    ViewRole: "can-view-role",
    AddRole: "can-add-role",
    EditRole: "can-edit-role",

    // Company (newer version)
    ViewCompany: "can-view-company",
    CreateCompany: "can-add-company",
    EditCompany: "can-edit-company",
    DeleteCompany: "can-delete-company",

    // Older company variant
    ViewCompanyDetail: "can-view-company-detail",
    AddCompanyDetail: "can-add-company-detail",
    EditCompanyDetail: "can-edit-company-detail",

    // Candidates
    ViewCandidate: "can-view-candidate",
    AddCandidate: "can-add-candidate",
    EditCandidate: "can-edit-candidate",
    DeleteCandidate: "can-delete-candidate",
    ExportCandidate: "can-export-candidate",

    // Documents
    ViewDocumentRepository: "can-view-document-repository",
    AssignDocument: "can-assign-document",
    AddDocument: "can-add-document",
    EditDocument: "can-edit-document",
    DeleteDocument: "can-delete-document",
    ViewDocumentAssignHistory: "can-view-document-assign-history",
    ViewOwnDocument: "can-view-own-document",

    // User & Security
    EditProfile: "can-edit-profile",
    Enable2FA: "can-enable-2fa",
    UpdateUserManual: "can-update-user-manual",

    // Other / Legacy
    ViewAdmin: "can-view-admin",
    AddAdmin: "can-add-admin",
    EditAdmin: "can-edit-admin",
    ViewPreBilling: "can-view-pre-billing",
    AddPreBilling: "can-add-pre-billing",
    EditPreBilling: "can-edit-pre-billing",
    ViewActiveUser: "can-view-active-user",
    ExportUser: "can-export-user",

    // Skills & Job Types
    ViewSkill: "can-view-skill",
    CreateSkill: "can-add-skill",
    EditSkill: "can-edit-skill",
    DeleteSkill: "can-delete-skill",
    ViewJobType: "can-view-job-type",
    CreateJobType: "can-add-job-type",
    EditJobType: "can-edit-job-type",
    DeleteJobType: "can-delete-job-type",

    // Departments
    ViewDepartment: "can-view-department",
    CreateDepartment: "can-add-department",
    EditDepartment: "can-edit-department",
    DeleteDepartment: "can-delete-department",

    // Designations
    ViewDesignation: "can-view-designation",
    CreateDesignation: "can-add-designation",
    EditDesignation: "can-edit-designation",
    DeleteDesignation: "can-delete-designation",

    // Job Categories
    ViewJobCategory: "can-view-job-category",
    CreateJobCategory: "can-add-job-category",
    EditJobCategory: "can-edit-job-category",
    DeleteJobCategory: "can-delete-job-category",

    // Job Requisitions
    ViewJobRequisition: "can-view-job-requisition",
    CreateJobRequisition: "can-add-job-requisition",
    EditJobRequisition: "can-edit-job-requisition",
    DeleteJobRequisition: "can-delete-job-requisition",

    // Job Postings
    ViewJobPosting: "can-view-job-posting",
    CreateJobPosting: "can-add-job-posting",
    EditJobPosting: "can-edit-job-posting",
    DeleteJobPosting: "can-delete-job-posting",
    ExportJobPosting: "can-export-job-posting",

    // Job Applications
    ViewJobApplication: "can-view-job-application",
    CreateJobApplication: "can-add-job-application",
    EditJobApplication: "can-edit-job-application",
    DeleteJobApplication: "can-delete-job-application",
    ExportJobApplication: "can-export-job-application",

    // Employee Employment
    ViewEmployeeEmployment: "can-view-employee-employment",
    AddEmployeeEmployment: "can-add-employee-employment",
    EditEmployeeEmployment: "can-edit-employee-employment",
    DeleteEmployeeEmployment: "can-delete-employee-employment",

    // Employee Posting
    ViewEmployeePosting: "can-view-employee-posting",
    AddEmployeePosting: "can-add-employee-posting",
    EditEmployeePosting: "can-edit-employee-posting",
    DeleteEmployeePosting: "can-delete-employee-posting",

    // CV Screening Stages
    ViewCVScreeningStages: "can-view-cv-screening-stages",
    AddCVScreeningStages: "can-add-cv-screening-stages",
    EditCVScreeningStages: "can-edit-cv-screening-stages",
    DeleteCVScreeningStages: "can-delete-cv-screening-stages",

    // Knowledge Base - Articles
    ViewKbArticle: "can-view-kb-article",
    CreateKbArticle: "can-add-kb-article",
    EditKbArticle: "can-edit-kb-article",
    DeleteKbArticle: "can-delete-kb-article",
    ExportKbArticle: "can-export-kb-article",

    // Knowledge Base - Categories
    ViewKbCategory: "can-view-kb-category",
    CreateKbCategory: "can-add-kb-category",
    EditKbCategory: "can-edit-kb-category",
    DeleteKbCategory: "can-delete-kb-category",
    ExportKbCategory: "can-export-kb-category",

    // Knowledge Base - Tags
    ViewKbTag: "can-view-kb-tag",
    CreateKbTag: "can-add-kb-tag",
    EditKbTag: "can-edit-kb-tag",
    DeleteKbTag: "can-delete-kb-tag",
    ExportKbTag: "can-export-kb-tag",

    // Job Screening Stage
    ViewJobScreeningStage: "can-view-job-screening-stage",
    CreateJobScreeningStage: "can-add-job-screening-stage",
    EditJobScreeningStage: "can-edit-job-screening-stage",
    DeleteJobScreeningStage: "can-delete-job-screening-stage",

    // ATS Scoring Rule
    ViewAtsScoringRule: "can-view--scoring-rule",
    CreateAtsScoringRule: "can-add--scoring-rule",
    EditAtsScoringRule: "can-edit--scoring-rule",
    DeleteAtsScoringRule: "can-delete--scoring-rule",

    // HR Announcements
    ViewHrAnnouncement: "can-view-hr-announcement",
    CreateHrAnnouncement: "can-add-hr-announcement",
    EditHrAnnouncement: "can-edit-hr-announcement",
    DeleteHrAnnouncement: "can-delete-hr-announcement",

    // Employee Settlements
    ViewEmployeeSettlements: "can-view-employee-settlements",
    CreateEmployeeSettlements: "can-add-employee-settlements",
    EditEmployeeSettlements: "can-edit-employee-settlements",
    DeleteEmployeeSettlements: "can-delete-employee-settlements",

    // Interview Assessments - Question Categories
    ViewAssessmentQuestionCategory: "can-view-assessment-question-category",
    AddAssessmentQuestionCategory: "can-add-assessment-question-category",
    EditAssessmentQuestionCategory: "can-edit-assessment-question-category",
    DeleteAssessmentQuestionCategory: "can-delete-assessment-question-category",

    // Interview Assessments - Questions
    ViewAssessmentQuestion: "can-view-assessment-question",
    AddAssessmentQuestion: "can-add-assessment-question",
    EditAssessmentQuestion: "can-edit-assessment-question",
    DeleteAssessmentQuestion: "can-delete-assessment-question",

    // Interview Assessments - Assessments
    ViewInterviewAssessment: "can-view-interview-assessment",
    AddInterviewAssessment: "can-add-interview-assessment",
    EditInterviewAssessment: "can-edit-interview-assessment",
    DeleteInterviewAssessment: "can-delete-interview-assessment",

    // Interview Assessments - Assessment Question Mapping
    ViewInterviewAssessmentQuestion: "can-view-interview-assessment-question",
    AddInterviewAssessmentQuestion: "can-add-interview-assessment-question",
    EditInterviewAssessmentQuestion: "can-edit-interview-assessment-question",
    DeleteInterviewAssessmentQuestion: "can-delete-interview-assessment-question",

    // Interview Assessments - Participants
    ViewInterviewAssessmentParticipant: "can-view-interview-assessment-participant",
    AddInterviewAssessmentParticipant: "can-add-interview-assessment-participant",
    EditInterviewAssessmentParticipant: "can-edit-interview-assessment-participant",
    DeleteInterviewAssessmentParticipant: "can-delete-interview-assessment-participant",

    // Interview Assessments - Participant Answers
    ViewInterviewAssessmentParticipantAnswer: "can-view-interview-assessment-participant-answer",
    AddInterviewAssessmentParticipantAnswer: "can-add-interview-assessment-participant-answer",
    EditInterviewAssessmentParticipantAnswer: "can-edit-interview-assessment-participant-answer",
    DeleteInterviewAssessmentParticipantAnswer: "can-delete-interview-assessment-participant-answer",

    // Interview Assessments - Participant Results
    ViewInterviewAssessmentParticipantResult: "can-view-interview-assessment-participant-result",
    AddInterviewAssessmentParticipantResult: "can-add-interview-assessment-participant-result",
    EditInterviewAssessmentParticipantResult: "can-edit-interview-assessment-participant-result",
    DeleteInterviewAssessmentParticipantResult: "can-delete-interview-assessment-participant-result",

    // Job Posting Screening Stage
    ViewJobPostingScreeningStage: "can-view-job-posting-screening-stage",
    AddJobPostingScreeningStage: "can-add-job-posting-screening-stage",
    EditJobPostingScreeningStage: "can-edit-job-posting-screening-stage",
    DeleteJobPostingScreeningStage: "can-delete-job-posting-screening-stage",

    // Job Posting Interview Round
    ViewJobPostingInterviewRound: "can-view-job-posting-interview-round",
    AddJobPostingInterviewRound: "can-add-job-posting-interview-round",
    EditJobPostingInterviewRound: "can-edit-job-posting-interview-round",
    DeleteJobPostingInterviewRound: "can-delete-job-posting-interview-round",

    // Shifts
    ViewShifts: "can-view-shifts",
    CreateShifts: "can-add-shifts",
    EditShifts: "can-edit-shifts",
    DeleteShifts: "can-delete-shifts",

    // Rosters
    ViewRosters: "can-view-rosters",
    CreateRosters: "can-add-rosters",
    EditRosters: "can-edit-rosters",
    DeleteRosters: "can-delete-rosters",

    // Holiday Groups
    ViewHolidayGroups: "can-view-holiday-groups",
    CreateHolidayGroups: "can-add-holiday-groups",
    EditHolidayGroups: "can-edit-holiday-groups",
    DeleteHolidayGroups: "can-delete-holiday-groups",

    // Document Types
    ViewDocumentTypes: "can-view-document-types",
    CreateDocumentTypes: "can-add-document-types",
    EditDocumentTypes: "can-edit-document-types",
    DeleteDocumentTypes: "can-delete-document-types",

    // Employment Tasks
    ViewEmploymentTasks: "can-view-employment-tasks",
    CreateEmploymentTasks: "can-add-employment-tasks",
    EditEmploymentTasks: "can-edit-employment-tasks",
    DeleteEmploymentTasks: "can-delete-employment-tasks",

    // Finance - Purchase Orders
    ViewClientPurchaseOrder: "can-view-client-purchase-order",
    CreateClientPurchaseOrder: "can-add-client-purchase-order",
    EditClientPurchaseOrder: "can-edit-client-purchase-order",

    ViewPartnerPurchaseOrder: "can-view-partner-purchase-order",
    CreatePartnerPurchaseOrder: "can-add-partner-purchase-order",
    EditPartnerPurchaseOrder: "can-edit-partner-purchase-order",

    // Finance - Rate Cards
    ViewClientRateCard: "can-view-client-rate-card",
    CreateClientRateCard: "can-add-client-rate-card",
    EditClientRateCard: "can-edit-client-rate-card",

    ViewPartnerRateCard: "can-view-partner-rate-card",
    CreatePartnerRateCard: "can-add-partner-rate-card",
    EditPartnerRateCard: "can-edit-partner-rate-card",

    // Finance - Pre Billing
    ViewClientPreBilling: "can-view-client-pre-billing",
    CreateClientPreBilling: "can-add-client-pre-billing",
    EditClientPreBilling: "can-edit-client-pre-billing",

    ViewPartnerPreBilling: "can-view-partner-pre-billing",
    CreatePartnerPreBilling: "can-add-partner-pre-billing",
    EditPartnerPreBilling: "can-edit-partner-pre-billing",

    ViewPartnerUploadedPreBilling: "can-view-partner-uploaded-prebilling",
    ViewPartnerUploadedInvoice: "can-view-partner-uploaded-invoice",

    ViewClientPreBillingReport: "can-view-client-pre-billing-report",

    // Finance - Invoices
    ViewClientInvoice: "can-view-client-invoice",
    CreateClientInvoice: "can-add-client-invoice",
    EditClientInvoice: "can-edit-client-invoice",

    // Partner Invoices
    ViewPartnerInvoice: "can-view-partner-invoice",
    AddPartnerInvoice: "can-add-partner-invoice",
    EditPartnerInvoice: "can-edit-partner-invoice",

    // Finance - Analytics
    ViewPartnerPOAnalytic: "can-view-partner-po-analytic",
    ViewClientPOAnalytic: "can-view-client-po-analytic",

    // Inventory
    ViewInventory: "can-view-inventory",
    AddInventory: "can-add-inventory",
    EditInventory: "can-edit-inventory",
    DeleteInventory: "can-delete-inventory",
    ExportInventory: "can-export-inventory",

    // Marketing
    ViewMarketingDashboard: "can-view-marketing-dashboard",

    // Leads & Segments
    ViewLead: "can-view-lead",
    AddLead: "can-add-lead",
    EditLead: "can-edit-lead",
    DeleteLead: "can-delete-lead",
    ExportLead: "can-export-lead",

    // Campaigns
    ViewCampaign: "can-view-campaign",
    AddCampaign: "can-add-campaign",
    EditCampaign: "can-edit-campaign",
    DeleteCampaign: "can-delete-campaign",
    ExportCampaign: "can-export-campaign",

    // Templates
    ViewMarketingTemplate: "can-view-marketing-template",
    AddMarketingTemplate: "can-add-marketing-template",
    EditMarketingTemplate: "can-edit-marketing-template",
    DeleteMarketingTemplate: "can-delete-marketing-template",

    // Quotations
    ViewQuotation: "can-view-quotation",
    AddQuotation: "can-add-quotation",
    EditQuotation: "can-edit-quotation",
    DeleteQuotation: "can-delete-quotation",

    // Marketing Settings
    ViewMarketingSettings: "can-view-marketing-settings",
    EditMarketingSettings: "can-edit-marketing-settings",

    // BGV - Dashboard
    ViewBGVDashboard: "can-view-bgv-dashboard",

    // BGV - Verification Types
    ViewBGVVerificationTypes: "can-view-bgv-verification-types",
    CreateBGVVerificationTypes: "can-add-bgv-verification-types",
    EditBGVVerificationTypes: "can-edit-bgv-verification-types",
    DeleteBGVVerificationTypes: "can-delete-bgv-verification-types",

    // BGV - Vendors
    ViewBGVVendors: "can-view-bgv-vendors",
    CreateBGVVendors: "can-add-bgv-vendors",
    EditBGVVendors: "can-edit-bgv-vendors",
    DeleteBGVVendors: "can-delete-bgv-vendors",

    // BGV - Policies
    ViewBGVPolicies: "can-view-bgv-policies",
    CreateBGVPolicies: "can-add-bgv-policies",
    EditBGVPolicies: "can-edit-bgv-policies",
    DeleteBGVPolicies: "can-delete-bgv-policies",

    // BGV - Checklist Templates
    ViewBGVChecklistTemplates: "can-view-bgv-checklist-templates",
    CreateBGVChecklistTemplates: "can-add-bgv-checklist-templates",
    EditBGVChecklistTemplates: "can-edit-bgv-checklist-templates",
    DeleteBGVChecklistTemplates: "can-delete-bgv-checklist-templates",

    // BGV - Employee BGV Cases
    ViewEmployeeBGVs: "can-view-employee-bgv",
    CreateEmployeeBGVs: "can-add-employee-bgv",
    EditEmployeeBGVs: "can-edit-employee-bgv",
    DeleteEmployeeBGVs: "can-delete-employee-bgv",

    // BGV - Employee BGV Items
    ViewEmployeeBGVItems: "can-view-employee-bgv-items",
    CreateEmployeeBGVItems: "can-add-employee-bgv-items",
    EditEmployeeBGVItems: "can-edit-employee-bgv-items",
    DeleteEmployeeBGVItems: "can-delete-employee-bgv-items",

    // BGV - Employee BGV Documents
    ViewEmployeeBGVDocuments: "can-view-employee-bgv-documents",
    CreateEmployeeBGVDocuments: "can-add-employee-bgv-documents",
    EditEmployeeBGVDocuments: "can-edit-employee-bgv-documents",
    DeleteEmployeeBGVDocuments: "can-delete-employee-bgv-documents",

    // BGV - Requests
    ViewBGVRequests: "can-view-bgv-requests",
    CreateBGVRequests: "can-add-bgv-requests",
    EditBGVRequests: "can-edit-bgv-requests",
    DeleteBGVRequests: "can-delete-bgv-requests",

    // BGV - Consents
    ViewBGVConsents: "can-view-bgv-consents",
    CreateBGVConsents: "can-add-bgv-consents",
    EditBGVConsents: "can-edit-bgv-consents",
    DeleteBGVConsents: "can-delete-bgv-consents",

    // BGV - Adverse Actions
    ViewBGVAdverseActions: "can-view-bgv-adverse-actions",
    CreateBGVAdverseActions: "can-add-bgv-adverse-actions",
    EditBGVAdverseActions: "can-edit-bgv-adverse-actions",
    DeleteBGVAdverseActions: "can-delete-bgv-adverse-actions",

    // BGV - Disputes
    ViewBGVDisputes: "can-view-bgv-disputes",
    CreateBGVDisputes: "can-add-bgv-disputes",
    EditBGVDisputes: "can-edit-bgv-disputes",
    DeleteBGVDisputes: "can-delete-bgv-disputes",

    // BGV - Escalations
    ViewBGVEscalations: "can-view-bgv-escalations",
    CreateBGVEscalations: "can-add-bgv-escalations",
    EditBGVEscalations: "can-edit-bgv-escalations",
    DeleteBGVEscalations: "can-delete-bgv-escalations",

    // BGV - Audit Logs
    ViewBGVAuditLogs: "can-view-bgv-audit-logs",

    // BGV - Communication Logs
    ViewBGVCommunicationLogs: "can-view-bgv-communication-logs",

    // BGV - Reverification Schedules
    ViewBGVReverificationSchedules: "can-view-bgv-reverification-schedules",
    CreateBGVReverificationSchedules: "can-add-bgv-reverification-schedules",
    EditBGVReverificationSchedules: "can-edit-bgv-reverification-schedules",
    DeleteBGVReverificationSchedules: "can-delete-bgv-reverification-schedules",

    // Performance Reviews
    ViewPerformanceReview: "can-view-performance-review",
    CreatePerformanceReview: "can-add-performance-review",
    EditPerformanceReview: "can-edit-performance-review",

    // Performance Cycles
    ViewPerformanceCycle: "can-view-performance-cycle",
    CreatePerformanceCycle: "can-add-performance-cycle",
    EditPerformanceCycle: "can-edit-performance-cycle",
    DeletePerformanceCycle: "can-delete-performance-cycle",

    // Performance Templates
    ViewPerformanceTemplate: "can-view-performance-template",
    CreatePerformanceTemplate: "can-add-performance-template",
    EditPerformanceTemplate: "can-edit-performance-template",
    DeletePerformanceTemplate: "can-delete-performance-template",

// Workflow
    ViewWorkflow: "can-view-workflow",
    CreateWorkflow: "can-add-workflow",
    EditWorkflow: "can-edit-workflow",
    DeleteWorkflow: "can-delete-workflow",
    ExportWorkflow: "can-export-workflow",

    // ==================== SYSTEM MANAGEMENT ====================
    // Messaging Manager
    ViewMessaging: "can-view-notification-manager",
    CreateMessaging: "can-create-notification-manager",
    EditMessaging: "can-edit-notification-manager",
    DeleteMessaging: "can-delete-notification-manager",
    ManageMessaging: "can-manage-notification-manager",
    TestMessaging: "can-send-test-notification",

    // Datasource Manager
    ViewDatasourceManager: "can-view-datasource-manager",
    CreateDatasourceManager: "can-create-datasource-manager",
    EditDatasourceManager: "can-edit-datasource-manager",
    DeleteDatasourceManager: "can-delete-datasource-manager",
    ManageDatasourceManager: "can-manage-datasource-manager",
    RunDatabaseMigration: "can-run-database-migration",
    ViewDatabaseLogs: "can-view-database-logs",

    // Backup Manager
    ViewBackupManager: "can-view-backup-manager",
    ManageBackupManager: "can-manage-backup-manager",
    CreateBackup: "can-create-backup",
    RestoreBackup: "can-restore-backup",
    DeleteBackup: "can-delete-backup",

    // System Settings
    ViewSystemSettings: "can-view-system-settings",
    EditSystemSettings: "can-edit-system-settings",
    ManageSystemConfiguration: "can-manage-system-configuration",

    // File Manager
    ViewFileManager: "can-view-file-manager",
    ManageFileManager: "can-manage-file-manager",
    UploadSystemFile: "can-upload-system-file",
    DeleteSystemFile: "can-delete-system-file",

    // Additional System
    ViewAuditLog: "can-view-audit-log",
    ExportAuditLog: "can-export-audit-log",

    ViewApiKeys: "can-view-api-keys",
    ManageApiKeys: "can-manage-api-keys",

    ViewFeatureFlags: "can-view-feature-flags",
    ManageFeatureFlags: "can-manage-feature-flags",

    ViewCacheManager: "can-view-cache-manager",
    ManageCacheManager: "can-manage-cache-manager",
    ClearCache: "can-clear-cache",

    ViewSecuritySettings: "can-view-security-settings",
    ManageSecuritySettings: "can-manage-security-settings",

    ViewSystemLogs: "can-view-system-logs",
    ManageSystemLogs: "can-manage-system-logs",

    ViewServerStatus: "can-view-server-status",
    ManageServerMaintenance: "can-manage-server-maintenance",


};

// PORTAL-LEVEL PERMISSIONS (portal access check)
export const PORTAL_PERMISSIONS = {
    HRMS: "can-access-hrms-portal",
    RECRUITMENT: "can-access-recruitment-portal",
    HELPDESK: "can-access-helpdesk-portal",
    FINANCE: "can-access-finance-portal",
    PMS: "can-access-pms-portal",
    INVENTORY: "can-access-inventory-portal",
    MARKETING: "can-access-marketing-portal",
    ADMIN: "can-access-admin-portal"
};
