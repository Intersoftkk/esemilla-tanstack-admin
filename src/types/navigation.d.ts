import type React from "react";

type BaseNavItem = {
	title: string;
	badge?: string;
	icon?: React.ElementType;
	description?: string;
	permissions?: Array<string>;
};

type NavLink = BaseNavItem & {
	url: LinkProps["to"] | (string & {});
	items?: never;
};

type NavCollapsible = BaseNavItem & {
	items: Array<BaseNavItem & { url: LinkProps["to"] | (string & {}) }>;
	url?: never;
};

type NavItem = NavCollapsible | NavLink;

export type NavGroup = {
	title: string;
	items: Array<NavItem>;
};
