import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {useAppraisalCycle} from "@/features/appraisal-cycle/context/appraisal-cycle-context.tsx";

export function AppraisalCyclePrimaryButtons() {

    const {setOpen} = useAppraisalCycle()

    return (
        <div className="flex gap-2">
            <Button className="space-x-1" onClick={() => setOpen('add')}>
                <span>Create Cycle</span>
                <Plus size={18}/>
            </Button>
        </div>
    )
}
