// #/features/plans/context/plans-context.tsx
import React, { useState } from 'react'
import useDialogState from '#/hooks/use-dialog-state'
import type { PlanRecord } from '#/features/plans/types/plans.type.ts'

type PlansDialogType =
    | 'add'
    | 'view'
    | 'edit'
    | 'delete'
    | 'features'
    | 'feature-manager'

interface PlansContextType {
    open: PlansDialogType | null
    setOpen: (type: PlansDialogType | null) => void
    currentRow: PlanRecord | null
    setCurrentRow: React.Dispatch<React.SetStateAction<PlanRecord | null>>
}

const PlansContext = React.createContext<PlansContextType | null>(null)

interface Props {
    children: React.ReactNode
}

/** Provides the dialog state shared by the plans page components. */
export default function PlansProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<PlansDialogType>(null)
    const [currentRow, setCurrentRow] = useState<PlanRecord | null>(null)

    return (
        <PlansContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </PlansContext.Provider>
    )
}

/** Accesses the plans dialog context. */
export const usePlans = () => {
    const context = React.useContext(PlansContext)
    if (!context) {
        throw new Error('usePlans must be used within a PlansProvider')
    }
    return context
}
