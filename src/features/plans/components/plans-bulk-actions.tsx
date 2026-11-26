// #/features/plans/components/plans-bulk-actions.tsx
import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'

import { ConfirmDialog } from '#/components/confirm-dialog.tsx'
import { DataTableBulkActions } from '#/components/datatable/data-table-bulk-actions.tsx'
import { Button } from '#/components/ui/button.tsx'
import { PERMISSIONS } from '#/config/permissions.config.ts'
import { PermissionGuard } from '#/features/auth/components/permission-guard.tsx'
import { useDeletePlansMutation } from '#/features/plans/queries/plan.queries.ts'

interface PlansBulkActionsProps {
    table: Table<any, any>
}

/** Bulk delete toolbar shown when table rows are selected. */
export function PlansBulkActions({ table }: PlansBulkActionsProps) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const selectedIds =
        table.getSelectedRowModel?.().rows.map((row) =>
            String((row.original as { id: string | number }).id),
        ) ?? []

    const mutation = useDeletePlansMutation({
        onSuccess: () => {
            table.resetRowSelection?.()
            setConfirmOpen(false)
        },
    })

    return (
        <>
            <DataTableBulkActions table={table} entityName="plan">
                <PermissionGuard
                    permissions={[PERMISSIONS.DeletePlan]}
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
                title="Delete selected plans"
                desc={`Are you sure you want to delete ${selectedIds.length} selected plan${selectedIds.length === 1 ? '' : 's'}? This cannot be undone.`}
                confirmText="Delete selected"
                destructive
            />
        </>
    )
}
