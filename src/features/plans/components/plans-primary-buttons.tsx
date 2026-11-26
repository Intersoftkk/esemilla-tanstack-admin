// #/features/plans/components/plans-primary-buttons.tsx
import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { usePlans } from '#/features/plans/context/plans-context.tsx'

/** Primary action button for creating a plan. */
export function PlansPrimaryButtons() {
    const { setOpen } = usePlans()

    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen('add')}>
                <span>Create Plan</span>
                <Plus size={18} />
            </Button>
        </div>
    )
}
