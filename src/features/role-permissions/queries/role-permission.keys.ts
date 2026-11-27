// #/features/role-permissions/queries/role-permission.keys.ts

export const ROLE_PERMISSION_KEYS = {
	all: ["role-permissions"] as const,
	/** Keys for paginated rolePermission lists. */
	lists: (params?: Record<string, unknown>) =>
		[...ROLE_PERMISSION_KEYS.all, "lists", params ?? {}] as const,
	/** Key for a single (unpaginated) rolePermission list. */
	list: (params?: Record<string, unknown>) =>
		[...ROLE_PERMISSION_KEYS.all, "list", params ?? {}] as const,
	/** Base key for rolePermission details. */
	details: () => [...ROLE_PERMISSION_KEYS.all, "detail"] as const,
	/** Key for a single rolePermission detail. */
	detail: (id: string | number) =>
		[...ROLE_PERMISSION_KEYS.details(), String(id)] as const,
	/** Key for the companies available to rolePermissions. */
	companies: () => [...ROLE_PERMISSION_KEYS.all, "companies"] as const,
};
