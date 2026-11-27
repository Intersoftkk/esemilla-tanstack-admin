// #/features/invoices/components/invoices-table-row-actions.tsx
import { Edit, EllipsisVertical, Eye, Settings2, Trash2 } from 'lucide-react'
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
import type { invoicesTableFeatures } from '#/features/invoices/config/invoices.config.ts'
import { useInvoices } from '#/features/invoices/context/invoices-context.tsx'
import type { InvoiceRecord } from '#/features/invoices/types/invoices.type.ts'

interface InvoicesTableRowActionsProps {
    row: Row<typeof invoicesTableFeatures, InvoiceRecord>
}

/** Row action menu with view, edit and delete permissions. */
export function InvoicesTableRowActions({ row }: InvoicesTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useInvoices()

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
                    permissions={[PLATFORM_PERMISSIONS.PlatformInvoiceView]}
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
                    permissions={[PLATFORM_PERMISSIONS.PlatformInvoiceEdit]}
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
                    permissions={[PLATFORM_PERMISSIONS.PlatformInvoiceEdit]}
                >
                    <DropdownMenuItem
                        className="w-full cursor-pointer"
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen('features')
                        }}
                    >
                        Features
                        <DropdownMenuShortcut>
                            <Settings2 size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </PermissionGuard>

                <PermissionGuard
                    permissions={[PLATFORM_PERMISSIONS.PlatformInvoiceDelete]}
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
