import React, {useState} from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import {AppraisalCycleRecord} from "@/features/appraisal-cycle/types/appraisal-cycle";

type AppraisalCycleDialogType = 'add' | 'view' | 'edit' | 'delete'

interface AppraisalCycleContextType {
    open: AppraisalCycleDialogType | null
    setOpen: (type: AppraisalCycleDialogType | null) => void
    currentRow: AppraisalCycleRecord | null
    setCurrentRow: React.Dispatch<React.SetStateAction<AppraisalCycleRecord | null>>
}

const AppraisalCycleContext = React.createContext<AppraisalCycleContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function AppraisalCycleProvider({children}: Props) {
    const [open, setOpen] = useDialogState<AppraisalCycleDialogType>(null)
    const [currentRow, setCurrentRow] = useState<AppraisalCycleRecord | null>(null)

    return (
        <AppraisalCycleContext.Provider
            value={{open, setOpen, currentRow, setCurrentRow}}
        >
            {children}
        </AppraisalCycleContext.Provider>
    )
}

export const useAppraisalCycle = () => {
    const context = React.useContext(AppraisalCycleContext)
    if (!context) {
        throw new Error(
            'useAppraisalCycle must be used within an AppraisalCycleProvider',
        )
    }
    return context
}
