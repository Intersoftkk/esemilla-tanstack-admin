// #/features/users/users-page.tsx
import { Users } from "lucide-react";

import { PageHeader } from "#/components/page-header.tsx";
import { PLATFORM_PERMISSIONS } from "#/config/permissions.config.ts";
import { PermissionGuard } from "#/features/auth/components/permission-guard";
import { UsersDialogs } from "#/features/users/components/users-dialogs.tsx";
import { UsersPrimaryButtons } from "#/features/users/components/users-primary-buttons.tsx";
import { UsersTable } from "#/features/users/components/users-table.tsx";
import UsersProvider from "#/features/users/context/users-context.tsx";
import type { UserSearch } from "#/features/users/schema/users-search.schema.ts";
import type { NavigateFn } from "#/hooks/use-table-url-state";

interface UsersPageProps {
	search: UserSearch;
	navigate: NavigateFn;
}

/** Users page entry point. */
export default function UsersPage({ search, navigate }: UsersPageProps) {
	return (
		<UsersProvider>
			<UsersPageContent search={search} navigate={navigate} />
		</UsersProvider>
	);
}

/** Page body rendered inside the users' provider. */
function UsersPageContent({ search, navigate }: UsersPageProps) {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Users"
				description="Platform users, their roles and access."
				icon={Users}
				iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
				actions={
					<>
						<PermissionGuard
							permissions={[PLATFORM_PERMISSIONS.PlatformUserCreate]}
						>
							<UsersPrimaryButtons />
						</PermissionGuard>
					</>
				}
			/>

			<UsersTable search={search} navigate={navigate} />

			<UsersDialogs />
		</div>
	);
}
