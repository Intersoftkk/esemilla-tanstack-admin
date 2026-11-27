// #/features/notifications/components/notifications-dialogs.tsx
import { NotificationsActionDialog } from '#/features/notifications/components/dialogs/notifications-action-dialog.tsx'
import { NotificationsDeleteDialog } from '#/features/notifications/components/dialogs/notifications-delete-dialog.tsx'
import { useNotifications } from '#/features/notifications/context/notifications-context.tsx'
import { NotificationsViewDialog } from '#/features/notifications/components/dialogs/notifications-view-dialog.tsx'

/** Renders all dialogs controlled by the notifications context. */
export function NotificationsDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useNotifications()

    const clearRow = () => {
        setTimeout(() => setCurrentRow(null), 500)
    }

    return (
        <>
            <NotificationsActionDialog
                key="notifications-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <NotificationsActionDialog
                        key={`notifications-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <NotificationsViewDialog
                        key={`notifications-view-${currentRow.id}`}
                        open={open === 'view'}
                        onOpenChange={() => {
                            setOpen('view')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <NotificationsDeleteDialog
                        key={`notifications-delete-${currentRow.id}`}
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
