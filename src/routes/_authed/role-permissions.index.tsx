// #/routes/_authed/role-permissions.index.tsx
import { createFileRoute } from "@tanstack/react-router";

import RolePermissionsPage from "#/features/role-permissions/role-permissions-page.tsx";
import { rolePermissionSearchSchema } from "#/features/role-permissions/schema/role-permissions-search.schema.ts";
import type { NavigateFn } from "#/hooks/use-table-url-state";
import { pageHead } from "#/lib/head";

export const Route = createFileRoute("/_authed/role-permissions/")({
	head: () => pageHead("Role Permissions"),
	validateSearch: rolePermissionSearchSchema,
	component: RolePermissionsRoute,
});

/** Route component for the role permissions page. */
function RolePermissionsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate() as unknown as NavigateFn;

	return <RolePermissionsPage search={search} navigate={navigate} />;
}
