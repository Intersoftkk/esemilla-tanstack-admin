// #/features/role-permissions/components/role-permissions-dialogs.tsx
import { RolePermissionsActionDialog } from '#/features/role-permissions/components/dialogs/role-permissions-action-dialog.tsx'
import { RolePermissionsDeleteDialog } from '#/features/role-permissions/components/dialogs/role-permissions-delete-dialog.tsx'
import { useRolePermissions } from '#/features/role-permissions/context/role-permissions-context.tsx'
import { RolePermissionsViewDialog } from '#/features/role-permissions/components/dialogs/role-permissions-view-dialog.tsx'

/** Renders all dialogs controlled by the rolePermissions context. */
export function RolePermissionsDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useRolePermissions()

    const clearRow = () => {
        setTimeout(() => setCurrentRow(null), 500)
    }

    return (
        <>
            <RolePermissionsActionDialog
                key="role-permissions-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <RolePermissionsActionDialog
                        key={`role-permissions-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <RolePermissionsViewDialog
                        key={`role-permissions-view-${currentRow.id}`}
                        open={open === 'view'}
                        onOpenChange={() => {
                            setOpen('view')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <RolePermissionsDeleteDialog
                        key={`role-permissions-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                </>
            )}
        </>
    )
}
