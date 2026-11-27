// #/features/users/components/users-table-row-actions.tsx
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
import type { usersTableFeatures } from '#/features/users/config/users.config.ts'
import { useUsers } from '#/features/users/context/users-context.tsx'
import type { UserRecord } from '#/features/users/types/users.ts'

interface UsersTableRowActionsProps {
    row: Row<typeof usersTableFeatures, UserRecord>
}

/** Row action menu with view, edit and delete permissions. */
export function UsersTableRowActions({ row }: UsersTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useUsers()

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
                    permissions={[PLATFORM_PERMISSIONS.PlatformUserView]}
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
                    permissions={[PLATFORM_PERMISSIONS.PlatformUserEdit]}
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
                    permissions={[PLATFORM_PERMISSIONS.PlatformUserDelete]}
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
