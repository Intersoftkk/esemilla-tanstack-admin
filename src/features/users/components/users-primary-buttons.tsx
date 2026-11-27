// #/features/users/components/users-primary-buttons.tsx
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useUsers } from '#/features/users/context/users-context.tsx'

/** Primary action button for creating a user. */
export function UsersPrimaryButtons() {
    const { setOpen } = useUsers()

    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen('add')}>
                <span>Create User</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
