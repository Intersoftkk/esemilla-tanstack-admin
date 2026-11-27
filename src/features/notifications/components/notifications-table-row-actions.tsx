// #/features/notifications/components/notifications-table-row-actions.tsx
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
import type { notificationsTableFeatures } from '#/features/notifications/config/notifications.config.ts'
import { useNotifications } from '#/features/notifications/context/notifications-context.tsx'
import type { NotificationRecord } from '#/features/notifications/types/notifications.type.ts'

interface NotificationsTableRowActionsProps {
    row: Row<typeof notificationsTableFeatures, NotificationRecord>
}

/** Row action menu with view, edit and delete permissions. */
export function NotificationsTableRowActions({ row }: NotificationsTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useNotifications()

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
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
