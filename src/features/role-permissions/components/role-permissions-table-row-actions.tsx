// #/features/role-permissions/components/role-permissions-table-row-actions.tsx
import { Edit, EllipsisVertical, Eye, Trash2 } from 'lucide-react'
import type { Row } from '@tanstack/react-table'

import { Button } from '#/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { PermissionGuard } from '#/features/auth/components/permission-guard'
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config'
import type { rolePermissionsTableFeatures } from '#/features/role-permissions/config/role-permissions.config.ts'
import { useRolePermissions } from '#/features/role-permissions/context/role-permissions-context.tsx'
import type { RolePermissionRecord } from '#/features/role-permissions/types/role-permissions.type.ts'

interface RolePermissionsTableRowActionsProps {
    row: Row<typeof rolePermissionsTableFeatures, RolePermissionRecord>
}

/** Row action menu with view, edit and delete permissions. */
export function RolePermissionsTableRowActions({ row }: RolePermissionsTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useRolePermissions()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex w-8 p-0 data-[state=open]:bg-muted"
                >
                    <EllipsisVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                <PermissionGuard
                    permissions={[PLATFORM_PERMISSIONS.PlatformRolePermissionView]}
                >
                    <DropdownMenuItem
                        className="w-full cursor-pointer"
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('view')
                        }}
                    >
                        View
                        <DropdownMenuShortcut>
                            <Eye size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard
                    permissions={[PLATFORM_PERMISSIONS.PlatformRolePermissionAssign]}
                >
                    <DropdownMenuItem
                        className="w-full cursor-pointer"
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('edit')
                        }}
                    >
                        Edit
                        <DropdownMenuShortcut>
                            <Edit size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </PermissionGuard>


                <PermissionGuard
                    permissions={[PLATFORM_PERMISSIONS.PlatformRolePermissionAssign]}
                >
                    <DropdownMenuItem
                        className="w-full cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('delete')
                        }}
                    >
                        Delete
                        <DropdownMenuShortcut>
                            <Trash2 size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </PermissionGuard>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
