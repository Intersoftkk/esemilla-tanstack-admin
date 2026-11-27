// #/features/subscriptions/components/subscriptions-dialogs.tsx
import { SubscriptionsActionDialog } from '#/features/subscriptions/components/dialogs/subscriptions-action-dialog.tsx'
import { SubscriptionsDeleteDialog } from '#/features/subscriptions/components/dialogs/subscriptions-delete-dialog.tsx'
import { useSubscriptions } from '#/features/subscriptions/context/subscriptions-context.tsx'
import { SubscriptionsViewDialog } from '#/features/subscriptions/components/dialogs/subscriptions-view-dialog.tsx'
import { SubscriptionsFeaturesDialog } from '#/features/subscriptions/components/dialogs/subscriptions-features-dialog.tsx'
import { FeaturesManagerDialog } from '#/features/subscriptions/components/dialogs/features-manager-dialog.tsx'

/** Renders all dialogs controlled by the subscriptions context. */
export function SubscriptionsDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useSubscriptions()

    const clearRow = () => {
        setTimeout(() => setCurrentRow(null), 500)
    }

    return (
        <>
            <FeaturesManagerDialog
                open={open === 'feature-manager'}
                onOpenChange={() => setOpen('feature-manager')}
            />

            <SubscriptionsActionDialog
                key="subscriptions-add"
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            {currentRow && (
                <>
                    <SubscriptionsActionDialog
                        key={`subscriptions-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <SubscriptionsViewDialog
                        key={`subscriptions-view-${currentRow.id}`}
                        open={open === 'view'}
                        onOpenChange={() => {
                            setOpen('view')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <SubscriptionsDeleteDialog
                        key={`subscriptions-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            clearRow()
                        }}
                        currentRow={currentRow}
                    />

                    <SubscriptionsFeaturesDialog
                        key={`subscriptions-features-${currentRow.id}`}
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
