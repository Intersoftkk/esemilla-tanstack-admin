// #/features/support/components/support-dialogs.tsx
import { SupportActionDialog } from '#/features/support/components/dialogs/support-action-dialog.tsx'
import { SupportDeleteDialog } from '#/features/support/components/dialogs/support-delete-dialog.tsx'
import { useSupport } from '#/features/support/context/support-context.tsx'
import { SupportViewDialog } from '#/features/support/components/dialogs/support-view-dialog.tsx'

/** Renders all dialogs controlled by the support context. */
export function SupportDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useSupport()

    const clearRow = () => {
        setTimeout(() => setCurrentRow(null), 500)
    }

    return (
        <>
            <SupportActionDialog
                key="support-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <SupportActionDialog
                        key={`support-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <SupportViewDialog
                        key={`support-view-${currentRow.id}`}
                        open={open === 'view'}
                        onOpenChange={() => {
                            setOpen('view')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <SupportDeleteDialog
                        key={`support-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                </>
            )}
        </>
    )
}
