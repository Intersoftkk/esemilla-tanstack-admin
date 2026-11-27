import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
	name: "Esemilla",
	shortName: "Esemilla",
	version: packageJson.version,
	copyright: `© ${currentYear} Esemilla. All rights reserved.`,

	meta: {
		title: "Esemilla — Platform Admin",
		description:
			"Internal platform console for the Esemilla team: tenants, subscriptions, billing, and the support queue in one workspace.",
		keywords:
			"esemilla, platform admin, tenant management, subscriptions, billing, support desk, audit log",
		author: "Esemilla Team",
	},

	tagline: "Platform admin console",
	headline: "The console behind every Esemilla school",
	subheadline:
		"Tenants, subscriptions, invoices, and the support queue in one workspace — with an audit trail behind every administrative change.",

	cta: {
		primary: "Sign in to the console",
		secondary: "Contact platform team",
		login: "Sign in",
	},

	links: {
		docs: "https://docs.esemilla.com",
		changelog: "https://esemilla.com/changelog",
		support: "mailto:support@esemilla.com",
		github: "https://github.com/esemilla/esemilla",
		website: "https://esemilla.com",
	},
};
