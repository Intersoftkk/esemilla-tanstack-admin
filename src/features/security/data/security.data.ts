// #/features/security/data/security.data.ts

export type SecurityTone = "positive" | "warning" | "negative" | "neutral";

export type EventSeverity = "info" | "warning" | "critical";

export type ProviderStatus = "connected" | "available";

export interface SecurityKpi {
	id: "mfa" | "sessions" | "failed" | "incidents";
	label: string;
	value: string;
	hint: string;
	tone: SecurityTone;
}

export interface AuthPolicy {
	id: string;
	label: string;
	detail: string;
	state: string;
	tone: SecurityTone;
}

export interface SsoProvider {
	id: string;
	name: string;
	protocol: string;
	status: ProviderStatus;
	accounts: string;
}

export interface SecurityEvent {
	id: string;
	time: string;
	actor: string;
	action: string;
	ip: string;
	severity: EventSeverity;
}

export interface ComplianceItem {
	id: string;
	framework: string;
	detail: string;
	coverage: number;
}

export const securityKpis: Array<SecurityKpi> = [
	{
		id: "mfa",
		label: "MFA adoption",
		value: "87%",
		hint: "41 of 47 platform users",
		tone: "positive",
	},
	{
		id: "sessions",
		label: "Active sessions",
		value: "42",
		hint: "across 9 devices",
		tone: "neutral",
	},
	{
		id: "failed",
		label: "Failed sign-ins",
		value: "6",
		hint: "last 24 hours",
		tone: "warning",
	},
	{
		id: "incidents",
		label: "Open incidents",
		value: "1",
		hint: "escalated 3h ago",
		tone: "negative",
	},
];

export const authPolicies: Array<AuthPolicy> = [
	{
		id: "password",
		label: "Password policy",
		detail:
			"12 characters, mixed case, number and symbol, rotated every 180 days.",
		state: "Enforced",
		tone: "positive",
	},
	{
		id: "mfa",
		label: "Multi-factor authentication",
		detail:
			"Required for every platform role. 6 users still on backup codes only.",
		state: "Attention",
		tone: "warning",
	},
	{
		id: "session",
		label: "Session timeout",
		detail:
			"Idle sessions expire after 30 minutes; absolute limit of 12 hours.",
		state: "Enforced",
		tone: "positive",
	},
	{
		id: "ip",
		label: "IP allowlist",
		detail: "Restricted to the VPN ranges for owner and admin roles only.",
		state: "Partial",
		tone: "warning",
	},
	{
		id: "impersonation",
		label: "Tenant impersonation",
		detail: "Requires an approved ticket and is recorded in the audit log.",
		state: "Enforced",
		tone: "positive",
	},
];

export const ssoProviders: Array<SsoProvider> = [
	{
		id: "okta",
		name: "Okta",
		protocol: "SAML 2.0",
		status: "connected",
		accounts: "38 accounts",
	},
	{
		id: "entra",
		name: "Microsoft Entra ID",
		protocol: "OIDC",
		status: "available",
		accounts: "Not linked",
	},
	{
		id: "google",
		name: "Google Workspace",
		protocol: "OIDC",
		status: "connected",
		accounts: "9 accounts",
	},
];

export const securityEvents: Array<SecurityEvent> = [
	{
		id: "evt_8841",
		time: "12 min ago",
		actor: "a.owusu@esemilla.io",
		action: "Granted platform.role-permission.assign",
		ip: "102.64.18.7",
		severity: "info",
	},
	{
		id: "evt_8840",
		time: "48 min ago",
		actor: "Unknown",
		action: "Failed sign-in (5 attempts)",
		ip: "45.148.10.204",
		severity: "critical",
	},
	{
		id: "evt_8839",
		time: "2 h ago",
		actor: "m.tan@esemilla.io",
		action: "Impersonated tenant tn_1017",
		ip: "102.64.18.31",
		severity: "warning",
	},
	{
		id: "evt_8838",
		time: "5 h ago",
		actor: "system",
		action: "Rotated SESSION_SECRET",
		ip: "—",
		severity: "info",
	},
	{
		id: "evt_8837",
		time: "1 d ago",
		actor: "k.adeyemi@esemilla.io",
		action: "Enabled MFA (authenticator app)",
		ip: "197.210.44.9",
		severity: "info",
	},
];

export const complianceItems: Array<ComplianceItem> = [
	{
		id: "soc2",
		framework: "SOC 2 Type II",
		detail: "Evidence collected, control owner assigned",
		coverage: 92,
	},
	{
		id: "gdpr",
		framework: "GDPR",
		detail: "Data processing agreements and retention policy",
		coverage: 78,
	},
	{
		id: "iso",
		framework: "ISO 27001",
		detail: "Access review cycle not yet documented",
		coverage: 54,
	},
];
