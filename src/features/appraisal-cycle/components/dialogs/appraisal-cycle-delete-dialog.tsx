import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

import type { AppraisalCycleRecord } from '@/features/appraisal-cycle/types/appraisal-cycle'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ConfirmDialog } from '@/components/confirm-dialog.tsx'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: AppraisalCycleRecord
}

export function AppraisalCycleDeleteDialog({
                                               open,
                                               onOpenChange,
                                               currentRow,
                                           }: Props) {
    const [value, setValue] = useState('')

    const handleDelete = () => {
        if (value.trim() !== String(currentRow.id)) return

        onOpenChange(false)
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={value.trim() !== String(currentRow.id)}
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="stroke-destructive mr-1 inline-block"
                        size={18}
                    />
                    Delete Appraisal Cycle
                </span>
            }
            desc={
                <div className="space-y-4">
                    <p className="mb-2">
                        Are you sure you want to delete the appraisal cycle with ID{' '}
                        <span className="font-bold">{currentRow.id}</span>?
                        <br />
                        This action will permanently remove this cycle from the system.
                        This cannot be undone.
                    </p>

                    <Label className="my-2">
                        Type <strong>{currentRow.id}</strong> to confirm:
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
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
            confirmText="Delete"
            destructive
        />
    )
}
