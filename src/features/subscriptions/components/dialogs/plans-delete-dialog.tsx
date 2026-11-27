// #/features/plans/components/dialogs/plans-delete-dialog.tsx
import { useState } from 'react'
import { AlertTriangle, Loader } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { ConfirmDialog } from '#/components/confirm-dialog.tsx'
import { useDeletePlanMutation } from '#/features/plans/queries/plan.queries.ts'
import type { PlanRecord } from '#/features/plans/types/plans.ts'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: PlanRecord
}

/** Confirmation dialog that deletes a plan after ID confirmation. */
export function PlansDeleteDialog({ open, onOpenChange, currentRow }: Props) {
    const [value, setValue] = useState('')
    const mutation = useDeletePlanMutation({
        onSuccess: () => {
            setValue('')
            onOpenChange(false)
        },
    })

    const handleDelete = () => {
        if (value.trim() !== String(currentRow.id)) return
        mutation.mutate(currentRow.id)
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) setValue('')
                onOpenChange(nextOpen)
            }}
            handleConfirm={handleDelete}
            disabled={
                mutation.isPending || value.trim() !== String(currentRow.id)
            }
            title={
                <span className="text-destructive">
                    {mutation.isPending ? (
                        <Loader className="stroke-destructive mr-1 inline-block h-4 w-4 animate-spin" />
                    ) : (
                        <AlertTriangle
                            className="stroke-destructive mr-1 inline-block"
                            size={18}
                        />
                    )}
                    Delete Plan
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p className="mb-2">
                        Are you sure you want to delete the plan with ID{' '}
                        <span className="font-bold">{currentRow.id}</span>?
                        <br />
                        This action will permanently remove this plan from the
                        system. This cannot be undone.
                    </p>

                    <Label className="my-2">
                        Type <strong>{currentRow.id}</strong> to confirm:
                        <Input
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            placeholder="Enter ID to confirm deletion."
                        />
                    </Label>

                    <Alert variant="destructive">
                        <AlertTitle>Warning!</AlertTitle>
                        <AlertDescription>
                            Please be careful, this operation cannot be undone.
                        </AlertDescription>
                    </Alert>
                </div>
            }
            confirmText={mutation.isPending ? 'Deleting...' : 'Delete'}
            destructive
        />
    )
}
