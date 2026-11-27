// #/features/notifications/components/notifications-primary-buttons.tsx
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useNotifications } from '#/features/notifications/context/notifications-context.tsx'

/** Primary action button for creating a notification. */
export function NotificationsPrimaryButtons() {
    const { setOpen } = useNotifications()

    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen('add')}>
                <span>Create Notification</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
