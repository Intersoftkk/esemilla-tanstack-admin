import type { ReactNode } from "react";
import { usePermission } from "#/features/auth/hooks/use-permission.ts";
import type { PermissionInput, RoleInput } from "#/features/auth/utils/auth.ts";

export interface PermissionGuardProps {
	children: ReactNode;
	roles?: RoleInput[];
	permissions?: PermissionInput[];
	requireAll?: boolean;
	fallback?: ReactNode;
}

export function PermissionGuard({
	children,
	roles = [],
	permissions = [],
	requireAll = false,
	fallback = null,
}: PermissionGuardProps) {
	const { hasAnyPermission, hasAllPermissions, hasAnyRole, hasAllRoles } =
		usePermission();

	if (permissions.length === 0 && roles.length === 0) {
		return <>{children}</>;
	}

	const hasValidPermissions =
		permissions.length === 0
			? true
			: requireAll
				? hasAllPermissions(permissions)
				: hasAnyPermission(permissions);

	const hasValidRoles =
		roles.length === 0
			? true
			: requireAll
				? hasAllRoles(roles)
				: hasAnyRole(roles);

	if (hasValidPermissions && hasValidRoles) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
}
