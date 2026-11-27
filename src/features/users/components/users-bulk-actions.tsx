// #/features/users/components/users-bulk-actions.tsx
import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

import { ConfirmDialog } from '#/components/confirm-dialog.tsx'
import { DataTableBulkActions } from '#/components/datatable/data-table-bulk-actions.tsx'
import { Button } from '#/components/ui/button.tsx'
import { PLATFORM_PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard.tsx'
import { useDeleteUsersMutation } from '#/features/users/queries/user.queries.ts'

interface UsersBulkActionsProps {
    table: Table<any, any>
}

/** Bulk delete toolbar shown when table rows are selected. */
export function UsersBulkActions({ table }: UsersBulkActionsProps) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const selectedIds =
        table.getSelectedRowModel?.().rows.map((row) =>
            String((row.original as { id: string | number }).id),
        ) ?? []

    const mutation = useDeleteUsersMutation({
        onSuccess: () => {
            table.resetRowSelection?.()
            setConfirmOpen(false)
        },
    })

    return (
        <>
            <DataTableBulkActions table={table} entityName="user">
                <PermissionGuard
                    permissions={[PLATFORM_PERMISSIONS.PlatformUserDelete]}
                >
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                    </Button>
                </PermissionGuard>
            </DataTableBulkActions>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                handleConfirm={() => mutation.mutate(selectedIds)}
                isLoading={mutation.isPending}
                disabled={selectedIds.length === 0}
                title="Delete selected users"
                desc={`Are you sure you want to delete ${selectedIds.length} selected user${selectedIds.length === 1 ? '' : 's'}? This cannot be undone.`}
                confirmText="Delete selected"
                destructive
            />
        </>
    )
}
