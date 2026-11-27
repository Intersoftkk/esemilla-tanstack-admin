// #/features/subscriptions/components/subscriptions-primary-buttons.tsx
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useSubscriptions } from '#/features/subscriptions/context/subscriptions-context.tsx'

/** Primary action button for creating a subscription. */
export function SubscriptionsPrimaryButtons() {
    const { setOpen } = useSubscriptions()

    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen('add')}>
                <span>Create Subscription</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
