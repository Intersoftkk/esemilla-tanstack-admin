// #/features/support/components/support-bulk-actions.tsx
import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

import { ConfirmDialog } from '#/components/confirm-dialog.tsx'
import { DataTableBulkActions } from '#/components/datatable/data-table-bulk-actions.tsx'
import { Button } from '#/components/ui/button.tsx'
import { useDeleteSupportsMutation } from '#/features/support/queries/support.queries.ts'

interface SupportBulkActionsProps {
    table: Table<any, any>
}

/** Bulk delete toolbar shown when table rows are selected. */
export function SupportBulkActions({ table }: SupportBulkActionsProps) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const selectedIds =
        table.getSelectedRowModel?.().rows.map((row) =>
            String((row.original as { id: string | number }).id),
        ) ?? []

    const mutation = useDeleteSupportsMutation({
        onSuccess: () => {
            table.resetRowSelection?.()
            setConfirmOpen(false)
        },
    })

    return (
        <>
            <DataTableBulkActions table={table} entityName="support">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmOpen(true)}
                >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                </Button>
            </DataTableBulkActions>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                handleConfirm={() => mutation.mutate(selectedIds)}
                isLoading={mutation.isPending}
                disabled={selectedIds.length === 0}
                title="Delete selected support"
                desc={`Are you sure you want to delete ${selectedIds.length} selected support${selectedIds.length === 1 ? '' : 's'}? This cannot be undone.`}
                confirmText="Delete selected"
                destructive
            />
        </>
    )
}
