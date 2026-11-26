import { AppraisalCycleActionDialog } from '@/features/appraisal-cycle/components/dialogs/appraisal-cycle-action-dialog.tsx'
import { AppraisalCycleDeleteDialog } from '@/features/appraisal-cycle/components/dialogs/appraisal-cycle-delete-dialog.tsx'
import { useAppraisalCycle } from '@/features/appraisal-cycle/context/appraisal-cycle-context'
import {AppraisalCycleViewDialog} from "@/features/appraisal-cycle/components/dialogs/appraisal-cycle-view-dialog.tsx";

export function AppraisalCycleDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useAppraisalCycle()

    return (
        <>
            <AppraisalCycleActionDialog
                key="appraisal-cycle-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <AppraisalCycleActionDialog
                        key={`appraisal-cycle-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <AppraisalCycleViewDialog
                        key={`appraisal-cycle-view-${currentRow.id}`}
                        open={open === 'view'}
                        onOpenChange={() => {
                            setOpen('view')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <AppraisalCycleDeleteDialog
                        key={`appraisal-cycle-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
