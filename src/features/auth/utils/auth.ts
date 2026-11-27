import type {
	PermissionRecord,
	Role,
} from "#/features/auth/types/role-permission.type.ts";
import type { User } from "#/features/auth/types/user.type.ts";

export type PermissionInput = string | PermissionRecord;
export type RoleInput = string | Role;

export function getPermissionName(permission: PermissionInput): string {
	return typeof permission === "string" ? permission : permission.name;
}

export function getRoleName(role: RoleInput): string {
	return typeof role === "string" ? role : role.name;
}

/**
 * Check if user has a specific role (by name or Role object)
 */
export function hasRole(
	user: User | null | undefined,
	role: RoleInput,
): boolean {
	if (!user?.roles || !Array.isArray(user.roles)) return false;
	const target = getRoleName(role).toLowerCase();
	return user.roles.some((r) => {
		const name = typeof r === "string" ? r : r?.name;
		return typeof name === "string" && name.toLowerCase() === target;
	});
}

/**
 * Check if user has ANY of the specified roles
 */
export function hasAnyRole(
	user: User | null | undefined,
	roles: RoleInput[],
): boolean {
	if (!user?.roles || roles.length === 0) return false;
	return roles.some((role) => hasRole(user, role));
}

/**
 * Check if user has ALL of the specified roles
 */
export function hasAllRoles(
	user: User | null | undefined,
	roles: RoleInput[],
): boolean {
	if (!user?.roles || roles.length === 0) return false;
	return roles.every((role) => hasRole(user, role));
}

/**
 * Get all unique permission names assigned to user (Direct permissions + Permissions via Roles)
 */
export function getAllUserPermissions(user: User | null | undefined): string[] {
	if (!user) return [];

	const permissionNames = new Set<string>();

	// 1. Direct permissions (maybe strings or objects)
	if (Array.isArray(user.permissions)) {
		user.permissions.forEach((p) => {
			const name = typeof p === "string" ? p : p.name;
			if (typeof name === "string" && name) permissionNames.add(name);
		});
	}

	// 2. Role permissions (roles may be strings or objects)
	if (Array.isArray(user.roles)) {
		user.roles.forEach((role) => {
			if (role && typeof role === "object" && Array.isArray(role.permissions)) {
				role.permissions.forEach((p) => {
					const name = typeof p === "string" ? p : p.name;
					if (typeof name === "string" && name) permissionNames.add(name);
				});
			}
		});
	}

	return Array.from(permissionNames);
}

/**
 * Check if user has a specific permission (by name or Permission/PermissionRecord object)
 */
export function hasPermission(
	user: User | null | undefined,
	permission: PermissionInput,
): boolean {
	if (!user) return false;
	const target = getPermissionName(permission).toLowerCase();
	const allPermissions = getAllUserPermissions(user);
	return allPermissions.some((p) => p.toLowerCase() === target);
}

/**
 * Check if user has ANY of the specified permissions
 */
export function hasAnyPermission(
	user: User | null | undefined,
	permissions: PermissionInput[],
): boolean {
	if (!user || permissions.length === 0) return false;
	return permissions.some((p) => hasPermission(user, p));
}

/**
 * Check if user has ALL of the specified permissions
 */
export function hasAllPermissions(
	user: User | null | undefined,
	permissions: PermissionInput[],
): boolean {
	if (!user || permissions.length === 0) return false;
	return permissions.every((p) => hasPermission(user, p));
}
