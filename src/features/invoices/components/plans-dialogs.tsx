// #/features/plans/components/plans-dialogs.tsx
import { PlansActionDialog } from '#/features/plans/components/dialogs/plans-action-dialog.tsx'
import { PlansDeleteDialog } from '#/features/plans/components/dialogs/plans-delete-dialog.tsx'
import { usePlans } from '#/features/plans/context/plans-context.tsx'
import { PlansViewDialog } from '#/features/plans/components/dialogs/plans-view-dialog.tsx'
import { PlansFeaturesDialog } from '#/features/plans/components/dialogs/plans-features-dialog.tsx'
import { FeaturesManagerDialog } from '#/features/plans/components/dialogs/features-manager-dialog.tsx'

/** Renders all dialogs controlled by the plans context. */
export function PlansDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = usePlans()

    const clearRow = () => {
        setTimeout(() => setCurrentRow(null), 500)
    }

    return (
        <>
            <FeaturesManagerDialog
                open={open === 'feature-manager'}
                onOpenChange={() => setOpen('feature-manager')}
            />

            <PlansActionDialog
                key="plans-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <PlansActionDialog
                        key={`plans-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <PlansViewDialog
                        key={`plans-view-${currentRow.id}`}
                        open={open === 'view'}
                        onOpenChange={() => {
                            setOpen('view')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <PlansDeleteDialog
                        key={`plans-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <PlansFeaturesDialog
                        key={`plans-features-${currentRow.id}`}
                        open={open === 'features'}
                        onOpenChange={() => {
                            setOpen('features')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
