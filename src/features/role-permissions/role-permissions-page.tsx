// #/features/role-permissions/role-permissions-page.tsx
import { ShieldCheck } from 'lucide-react'

import { PageHeader } from '#/components/page-header.tsx'
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard'
import { RolePermissionsDialogs } from '#/features/role-permissions/components/role-permissions-dialogs.tsx'
import { RolePermissionsPrimaryButtons } from '#/features/role-permissions/components/role-permissions-primary-buttons.tsx'
import { RolePermissionsTable } from '#/features/role-permissions/components/role-permissions-table.tsx'
import RolePermissionsProvider from '#/features/role-permissions/context/role-permissions-context.tsx'
import type { RolePermissionSearch } from '#/features/role-permissions/schema/role-permissions-search.schema.ts'
import type { NavigateFn } from '#/hooks/use-table-url-state'

interface RolePermissionsPageProps {
    search: RolePermissionSearch
    navigate: NavigateFn
}

/** RolePermissions page entry point. */
export default function RolePermissionsPage({ search, navigate }: RolePermissionsPageProps) {
    return (
        <RolePermissionsProvider>
            <RolePermissionsPageContent search={search} navigate={navigate} />
        </RolePermissionsProvider>
    )
}

/** Page body rendered inside the role permissions provider. */
function RolePermissionsPageContent({ search, navigate }: RolePermissionsPageProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Role Permissions"
                description="Roles, permissions and the assignments granted to each role."
                icon={ShieldCheck}
                iconBgClassName="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/15"
                actions={
                    <>
                        <PermissionGuard
                            permissions={[PLATFORM_PERMISSIONS.PlatformRolePermissionAssign]}
                        >
                            <RolePermissionsPrimaryButtons />
                        </PermissionGuard>
                    </>
                }
            />

            <RolePermissionsTable search={search} navigate={navigate} />

            <RolePermissionsDialogs />
        </div>
    )
}
