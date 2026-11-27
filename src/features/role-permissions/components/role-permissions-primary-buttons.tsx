// #/features/role-permissions/components/role-permissions-primary-buttons.tsx
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useRolePermissions } from '#/features/role-permissions/context/role-permissions-context.tsx'

/** Primary action button for creating a role permission. */
export function RolePermissionsPrimaryButtons() {
    const { setOpen } = useRolePermissions()

    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen('add')}>
                <span>Create RolePermission</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
